---
title: API
---

# API - Récupération et ajout à la volée
Vous pouvez récupérer et ajouter des instances de classe à la volée par l'objet [MetadataStorage](http://localhost:3000/#/fr/MetadataStorage) en utilisant les méthodes:  
_Récupération_
```typescript
MetadataStorage.Instance.Di.getService<ClassType>(classType: ClassType, id?: string | number);
```
_Ajout_
```typescript
MetadataStorage.Instance.Di.addService<ClassType>(classType: ClassType, id?: string | number);
```