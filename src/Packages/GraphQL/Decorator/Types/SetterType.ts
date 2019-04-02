export type SetterType<Type> = Partial<Type> | ((...params: any[]) => Partial<Type>);
