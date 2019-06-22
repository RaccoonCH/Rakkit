(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{192:function(e,t,a){"use strict";a.r(t);var i=a(0),n=Object(i.a)({},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"service-and-injection-dependency-injection"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#service-and-injection-dependency-injection","aria-hidden":"true"}},[e._v("#")]),e._v(" Service and injection (Dependency injection)")]),e._v(" "),a("p",[e._v("We often find this notion in Angular and it will be useful to us in order to declare services that will be instances available everywhere in your application and injectable in classes."),a("br"),e._v("\nThanks to Rakkit's service system you will be able to declare the same class as a service several times.")]),e._v(" "),a("h2",{attrs:{id:"how-does-it-work"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#how-does-it-work","aria-hidden":"true"}},[e._v("#")]),e._v(" How does it work?")]),e._v(" "),a("p",[e._v("When you declare a class as a service it will be instantiated and an ID will be assigned to it and then it will be stored in a container containing all instances of your application. You will then be able to retrieve your service instance using the "),a("code",[e._v("MetadataStorage")]),e._v(" object or simply by injecting it into a class by the constructor or by property.")]),e._v(" "),a("h2",{attrs:{id:"what-s-the-point"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#what-s-the-point","aria-hidden":"true"}},[e._v("#")]),e._v(" What's the point?")]),e._v(" "),a("p",[e._v("Let's say you have to create an application that will look for data every 5 minutes on a site in order to send it via websocket to customers and also make it available via a REST API. You will then need to have one or more instances of a certain class doing this work which probably implies having a singleton or a list of instances of this class somewhere.... Declaring a class as a service allows you to do this work for you and not clutter up your code. In addition, it generally improves the comprehension and readability of the code.")])])},[],!1,null,null,null);t.default=n.exports}}]);