import { MetadataBuilder } from "../../../Packages/Core/Logic/MetadataBuilder";
import {
  IDecorator,
  IService,
  IInject,
  ReturnedService,
  IClassType,
  IDiId,
  ArrayDiError,
  DiId,
  InstanceOf
} from "../../..";

export class DiMetadataBuilder extends MetadataBuilder {
  private _services: IDecorator<IService<any>>[] = [];
  private _injections: IDecorator<IInject>[] = [];

  get Services() {
    return this._services as ReadonlyArray<IDecorator<IService<any>>>;
  }

  get Injections() {
    return this._injections as ReadonlyArray<IDecorator<IInject>>;
  }

  Build() {
    this._services.map((item) => {
      this.extendsSuperclass(item.originalClass);
      this.initializeInstance(item);
    });
    this._injections.map((item) => {
      if (item.key) {
        const destinationServices = this._services.filter((service) =>
          service.originalClass === item.originalClass
        );
        const type = item.params.injectionType();
        const services = item.params.ids.reduce((prev, id) => {
          const instance = this.GetService(type, id);
          if (instance) {
            return [
              ...prev,
              instance
            ];
          } else {
            throw new Error(`The service ${type.name} with the id ${id} doesn't exists`);
          }
        }, []);
        destinationServices.map((service) =>
          service.params.instance[item.key] = item.params.isArray ? services : services[0]
        );
      }
    });
  }

  GetService(service: IDecorator<IDiId>): ReturnedService<any>;
  GetService<ClassType>(
    classType: ClassType,
    id?: string | number
  ): InstanceOf<ClassType>;
  GetService<ClassType>(
    classtypeOrService: ClassType | IDecorator<IDiId>,
    id?: string | number
  ) {
    const isService = typeof classtypeOrService !== "function";
    const comparedClassType = isService ? (classtypeOrService as IDecorator<any>).originalClass : classtypeOrService;
    const comparedId = isService ? (classtypeOrService as IDecorator<IDiId>).params.id : id;
    const service = this._services.find((service) =>
      service.originalClass === comparedClassType && service.params.id === comparedId
    );
    if (service) {
      if (isService) {
        return service;
      }
      return service.params.instance;
    }
  }

  /**
   * TODO: Correct add at runtime
   * Declare a class as a service, you can inject items and use it as a service
   * @param item
   */
  AddService(item: IDecorator): ReturnedService;
  AddService<ClassType extends Function>(
    classType: ClassType,
    id?: DiId
  ): InstanceOf<ClassType>;
  AddService<ClassType>(
    itemOrClass: IDecorator | ClassType,
    id?: DiId
  ) {
    const isClass = typeof itemOrClass === "function";
    const classFunc = isClass ? (itemOrClass as ClassType) : (itemOrClass as IDecorator).originalClass;
    const service: IDecorator<IService> = {
      originalClass: (classFunc as Function),
      class: (classFunc as Function),
      key: classFunc.constructor.name,
      category: "di",
      params: {
        id: isClass ? id : (itemOrClass as IDecorator<IDiId>).params.id
      }
    };

    const serviceAlreadyExists = this.GetService(service);
    if (serviceAlreadyExists) {
      throw new Error(`
        ${(serviceAlreadyExists.params.instance as Object).constructor.name} with the id "${serviceAlreadyExists.params.id}"
        is already declared as a service don't decorate it twice.
        @Websocket, @Router, @AfterMiddleware, @BeforeMiddleware is implicitly decorated by @Service
      `);
    } else {
      const category = !isClass ? (itemOrClass as IDecorator).category : undefined;
      if (category !== "di") {
        service.params.instance = this.initializeInstance(service);
      }
      this._services.push(service);
      if (isClass) {
        return service.params.instance;
      }
      return service;
    }
  }

  AddInjection(item: IDecorator<IInject>) {
    if (item.params.ids.length < 1) {
      item.params.ids = [ undefined ];
    }
    this._injections.push(item);
  }

  private extendsSuperclass(classType: Function) {
    const superClass: Function = Object.getPrototypeOf(classType);
    if (superClass) {
      this.extendsSuperclass(superClass);
      const classInjections = this._injections.filter((injection) =>
        injection.originalClass === (superClass as Function)
      );
      const newInjections = classInjections.map<IDecorator<IInject>>((injection) => {
        return {
          originalClass: classType,
          class: classType,
          key: injection.key,
          category: "di",
          params: injection.params
        };
      });
      this._injections = this._injections.concat(newInjections);
    }
  }

  /**
   * Initialize a service by his constructor and his params
   * @param item The item to initialize
   */
  private initializeInstance(item: IDecorator<IService>) {
    if (item) {
      if (!item.params.instance) {
        const classType = item.originalClass as IClassType<any>;
        // Get the constructor params of the class
        const initParams: Function[] = Reflect.getMetadata("design:paramtypes", item.originalClass);
        if (initParams) {
          const instances = initParams.reduce<ReturnedService<any>[]>((prev, param, index) => {
            let value = undefined;

            // Get the injections of the class that is in the constructor
            // at the same index
            const injection = this._injections.find((injection) => {
              return (
                injection.originalClass === item.originalClass &&
                injection.params.paramIndex === index
              );
            });
            if (injection) {
              // For each injection get the services with the specified ids
              // constructor(@Inject(type => MyService, 1, 2) private _myService: MyService[])
              const instances = injection.params.ids.map((id) => {
                const classType = injection.params.injectionType() || param;
                const serviceItem: IDecorator<IDiId> = {
                  originalClass: classType,
                  class: classType,
                  key: undefined,
                  category: "di",
                  params: {
                    id
                  }
                };
                const service = this.GetService(serviceItem);

                // Initialize the instance of the service that is passed into parameters
                return this.initializeInstance(service);
              });
              // TODO: Verify array
              const isArray = Array.isArray(param.prototype);
              if (isArray && !injection.params.injectionType()) {
                throw new ArrayDiError(item.originalClass, ` On constructor at index: ${index}`);
              }
              const isServicesAnArray = instances.length > 1;
              value = isServicesAnArray ? instances : instances[0];
            } else {
              // If the constructor injection is not decorated but the type is a service
              // constructor(private _service: MyService)
              const serviceItem: IDecorator<IDiId> = {
                originalClass: param,
                class: param,
                key: undefined,
                category: "di",
                params: {
                  id: undefined
                }
              };
              const service = this.GetService(serviceItem);
              value = this.initializeInstance(service);
            }
            return [
              ...prev,
              value
            ];
          }, []);
          item.params.instance = new classType(...instances);
        } else {
          item.params.instance = new classType();
        }
      }
      return item.params.instance;
    }
    return undefined;
  }
}
