# Contribution
To contribute you can simply clone the project and submit your pull-request.  
Please provide unit tests as well as an example for your functionality if it targets code.  
Please also respect the naming conventions of the commits and the code by installing `ts-lint` (`npm i -g ts-lint`) globally.  
It is important to provide a good description of your changes in the pull request (In English and in addition you can put the version in French, but you must anyway provide an English version so that the rest of the world can understand).  

We deliberately left the folder **.vscode**, which provides the debugging scripts. It is then recommended to use this one to develop on Rakkit.  

Declarative of files and architecture:  

| File / Folder | Description |
| --- | --- |
| MetadataStorage.ts | Manages all the logic of decorators and builds objects from their information |
| Rakkit.ts | Initializes servers and external dependencies (Koa, Socket.io) |
| AppLoader.ts | Anything that involves loading into memory or files |
| types | Contains all types / interfaces / abstract classes / classes without particular logic (which define a type) used by Rakkit |
| misc | All miscellaneous functions not important for the operation of the Rakkit |
| logic | All classes containing logic |
| types | All the types of errors that Rakkit activates |
| decorators | All definitions of decorators |
| examples | Examples of how to use Rakkit |
