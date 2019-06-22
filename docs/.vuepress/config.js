module.exports = {
  title: "Rakkit",
  description: "A framework written in TypeScript that provides REST/GraphQL API and Websocket tools to build amazing server-side applications",
  lang: "en",
  locales: {
    "/": {
      path: "/",
      lang: "en"
    }
    // "/fr/": {
    //   lang: "fr",
    //   title: "Rakkit",
    //   description: "Un framework écrit en TypeScript qui permet de créer des API REST/GraphQL pour vos applications backend"
    // },
  },
  plugins: [
    [ 
      "@vuepress/google-analytics",
      {
        "ga": "UA-128796921-2"
      }
    ]  
  ],
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon/favicon-96x96.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png"}],
    ['link', { rel: "manifest", href: "/favicon/site.webmanifest"}],
    ['link', { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#3a0839"}],
    ['link', { rel: "shortcut icon", href: "/favicon/favicon.ico"}],
    ['meta', { name: "msapplication-TileColor", content: "#3a0839"}],
    ['meta', { name: "msapplication-config", content: "/favicon/browserconfig.xml"}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
  ],
  themeConfig: {
    logo: '/logo.png',
    repo: "raccoonch/rakkit",
    docsDir: "docs",
    editLinks: true,
    locales: {
      "/": {
        editLinkText: "Edit this page on GitHub",
        sidebar: [
          {
            title: "Getting started",
            collapsable: false,
            children: [
              "/start/installation",
              "/start/getting-started",
              "/start/rakkit",
              "/start/demos"
            ]
          },
          {
            title: "GraphQL",
            collapsable: true,
            children: [
              {
                title: "Getting Started",
                collapsable: false,
                children: [
                  "/graphql/start/introduction",
                  "/graphql/start/installation",
                  "/graphql/start/bootstrap",
                ]
              },
              {
                title: "Type definition",
                collapsable: false,
                children: [
                  "/graphql/type/type-definition",
                  "/graphql/type/inheritance",
                  "/graphql/type/generics",
                  "/graphql/type/interfaces",
                  "/graphql/type/unions",
                  "/graphql/type/enums",
                  "/graphql/type/scalars",
                  "/graphql/type/type-creator"
                ]
              },
              {
                title: "Networking & Queries",
                collapsable: false,
                children: [
                  "/graphql/query/resolvers",
                  "/graphql/query/middlewares",
                  "/graphql/query/subscriptions"
                ]
              },
              {
                title: "Misc",
                collapsable: false,
                children: [
                  "/graphql/misc/write-schema"
                ]
              }
            ]
          },
          {
            title: "REST",
            collapsable: true,
            children: [
              "/rest/router",
              "/rest/middlewares",
              "/rest/koa-middlewares",
              "/rest/serving-static-files"
            ]
          },
          {
            title: "Websocket",
            collapsable: true,
            children: [
              "/ws/introduction",
              "/ws/server-side",
              "/ws/client-side"
            ]
          },
          {
            title: "DI",
            collapsable: true,
            children: [
              "/di/introduction",
              "/di/services-and-injections",
              "/di/inheritance",
              "/di/api",
              "/di/limitations"
            ]
          },
          {
            title: "Development",
            collapsable: false,
            children: [
              "/dev/contributing",
              "/dev/changelog"
            ]
          }
        ]
      }
      // "/fr/": {
      //   editLinkText: "Editer cette page sur GitHub",
      //   sidebar: [
      //     {
      //       title: "Commencer",
      //       collapsable: false,
      //       children: [
      //         "/fr/start/installation",
      //         "/fr/start/demos"
      //       ]
      //     },
      //     {
      //       title: "GraphQL",
      //       collapsable: true,
      //       children: [
      //         {
      //           title: "Getting Started",
      //           collapsable: false,
      //           children: [
      //             "/graphql/start/introduction",
      //             "/graphql/start/installation",
      //             "/graphql/start/bootstrap"
      //           ]
      //         },
      //         {
      //           title: "Type definition",
      //           collapsable: false,
      //           children: [
      //             "/graphql/type/type-definition",
      //             "/graphql/type/inheritance",
      //             "/graphql/type/generics",
      //             "/graphql/type/interfaces",
      //             "/graphql/type/unions",
      //             "/graphql/type/enums",
      //             "/graphql/type/scalars"
      //           ]
      //         },
      //         {
      //           title: "Networking & Queries",
      //           collapsable: false,
      //           children: [
      //             "/graphql/query/resolvers",
      //             "/graphql/query/middlewares",
      //             "/graphql/query/subscriptions"
      //           ]
      //         },
      //         {
      //           title: "Misc",
      //           collapsable: false,
      //           children: [
      //             "/graphql/misc/write-schema"
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       title: "REST",
      //       collapsable: true,
      //       children: [
      //         "/fr/rest/router",
      //         "/fr/rest/middlewares",
      //         "/fr/rest/koa-middlewares",
      //         "/fr/rest/serving-static-files"
      //       ]
      //     },
      //     {
      //       title: "Websocket",
      //       collapsable: true,
      //       children: [
      //         "/fr/ws/introduction",
      //         "/fr/ws/server-side",
      //         "/fr/ws/client-side"
      //       ]
      //     },
      //     {
      //       title: "DI",
      //       collapsable: true,
      //       children: [
      //         "/fr/di/introduction",
      //         "/fr/di/services-and-injections",
      //         "/fr/di/inheritance",
      //         "/fr/di/api",
      //         "/fr/di/limitations"
      //       ]
      //     },
      //     {
      //       title: "API",
      //       collapsable: true,
      //       children: [
      //         "/fr/api/metadata-storage",
      //         "/fr/api/rakkit"
      //       ]
      //     },
      //     {
      //       title: "Développement",
      //       collapsable: true,
      //       children: [
      //         "/fr/dev/contributing",
      //         "/fr/dev/changelog"
      //       ]
      //     }
      //   ]
      // }
    }
  }
}
