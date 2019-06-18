---
title: Introduction
---

# Service and injection (Dependency injection)
We often find this notion in Angular and it will be useful to us in order to declare services that will be instances available everywhere in your application and injectable in classes.  
Thanks to Rakkit's service system you will be able to declare the same class as a service several times.

## How does it work?
When you declare a class as a service it will be instantiated and an ID will be assigned to it and then it will be stored in a container containing all instances of your application. You will then be able to retrieve your service instance using the `MetadataStorage` object or simply by injecting it into a class by the constructor or by property.

## What's the point?
Let's say you have to create an application that will look for data every 5 minutes on a site in order to send it via websocket to customers and also make it available via a REST API. You will then need to have one or more instances of a certain class doing this work which probably implies having a singleton or a list of instances of this class somewhere.... Declaring a class as a service allows you to do this work for you and not clutter up your code. In addition, it generally improves the comprehension and readability of the code.
