---
title: The Rakkit class
---

## Rakkit
This is the object that allows you to manipulate the Rakkit application, it is a singleton so you can access its instance via the `Rakkit.Instance` property that provides the main instances of the `Koa` and `Socket.io` dependencies for special cases where you need to access it.  

With this object you can stop the application (`stop`) and start it (`start`)

## MetadataStorage 
It provides various properties that may be useful to you such as: services, injections, routers, endoints, websocket, etc....  
You just have to remember that it is he who manages the decorators, so you can access the information about them through this object instance.  
You can access to it via: `Rakkit.MetadataStorage`. 

Here are the available properties and their descriptions via `Rakkit.MetadataStorage`, (They are all in readonly):

::: warning
**Except for Services:**  
The methods that are prefixed by "Add" are used by decorators **at compile time** and can be remove from public in a near future.
:::
