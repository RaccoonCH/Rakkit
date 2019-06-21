---
title: API
---

# API - Get and add at runtime
You can retrieve and add class instances on the fly by the object [MetadataStorage](/start/rakkit/#metadatastorage) using methods:  
_Get_
```typescript
MetadataStorage.Instance.Di.getService<ClassType>(classType: ClassType, id?: string | number);
```
_Add_
```typescript
MetadataStorage.Instance.Di.addService<ClassType>(classType: ClassType, id?: string | number);
```