import { Type, TypeParams, IPackageParams } from '../class/FrontTypes'
import { mainInstance } from '../..'

/**
 * Declare a RakkitPackge to show into front-end
 * It always called after Attribute decorator
 * @param rakkitPackage The RakkitPackage object with informations (description, icon, ...)
 */
export const Package = (rakkitPackage?: IPackageParams): Function => {
  return (target: Function): void => {
    const className = target.name.toLowerCase()
    mainInstance.AddRp({
      id: className,
      name: target.name,
      ...(rakkitPackage || {}),
      attributes: []
    })
  }
}

/**
 * Pupulate the attributes into an object,
 * it's a temp variable because it's called before Package decorator
 * It always called before Package decorator
 * @param type The front-end type, it describe how the datas will be displayed
 */
export const Attribute = (type: Type, params: TypeParams = { isEditable: true, isInHeader: true, isSearchable: false, placeOrder: 0 }): Function => {
  return (target: Object, key: string): void => {
    const className = target.constructor.name.toLowerCase()
    mainInstance.AddRpAttribute(className, key, type, params)
  }
}
