import { Service } from "../../../DI/Decorator/Decorators/Service";

@Service()
@Service(1)
export class TestService {
  TestValue: any = {};
}
