# Rakkit object
This is the object that allows you to manipulate the Rakkit application, it is a singleton so you can access its instance via the `Rakkit.Instance` property that provides the main instances of the `Koa` and `Socket.io` dependencies for special cases where you need to access it.  

With this object you can stop the application (`stop`) and start it (`start`)
