module.exports = {
  title: "Rakkit",
  description: "A framework written in TypeScript that provides REST/GraphQL API and Websocket tools to build amazing server-side applications",
  lang: "en",
  base: "/Rakkit/",
  locales: {
    "/en/": {
      path: "/",
      lang: "en"
    },
    "/fr/": {
      lang: "fr",
      title: "Rakkit",
      description: "Un framework écrit en TypeScript qui permet de créer des API REST/GraphQL pour vos applications backend"
    },
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
      "/en/": {
        editLinkText: "Edit this page on GitHub",
        sidebar: [
          {
            title: "Getting started",
            collapsable: false,
            children: [
              "/en/start/installation",
              "/en/start/demos"
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
                  "/en/graphql/start/introduction",
                  "/en/graphql/start/installation",
                  "/en/graphql/start/bootstrap",
                ]
              },
              {
                title: "Type definition",
                collapsable: false,
                children: [
                  "/en/graphql/type/type-definition",
                  "/en/graphql/type/inheritance",
                  "/en/graphql/type/generics",
                  "/en/graphql/type/interfaces",
                  "/en/graphql/type/unions",
                  "/en/graphql/type/enums",
                  "/en/graphql/type/scalars",
                  "/en/graphql/type/type-creator"
                ]
              },
              {
                title: "Networking & Queries",
                collapsable: false,
                children: [
                  "/en/graphql/query/resolvers",
                  "/en/graphql/query/middlewares",
                  "/en/graphql/query/subscriptions"
                ]
              },
              {
                title: "Misc",
                collapsable: false,
                children: [
                  "/en/graphql/misc/write-schema"
                ]
              }
            ]
          },
          {
            title: "REST",
            collapsable: true,
            children: [
              "/en/rest/router",
              "/en/rest/middlewares",
              "/en/rest/koa-middlewares",
              "/en/rest/serving-static-files"
            ]
          },
          {
            title: "Websocket",
            collapsable: true,
            children: [
              "/en/ws/introduction",
              "/en/ws/server-side",
              "/en/ws/client-side"
            ]
          },
          {
            title: "DI",
            collapsable: true,
            children: [
              "/en/di/introduction",
              "/en/di/services-and-injections",
              "/en/di/inheritance",
              "/en/di/api",
              "/en/di/limitations"
            ]
          },
          {
            title: "API",
            collapsable: true,
            children: [
              "/en/api/metadata-storage",
              "/en/api/rakkit"
            ]
          },
          {
            title: "Development",
            collapsable: false,
            children: [
              "/en/dev/contributing",
              "/en/dev/changelog"
            ]
          }
        ]
      },
      "/fr/": {
        editLinkText: "Editer cette page sur GitHub",
        sidebar: [
          {
            title: "Commencer",
            collapsable: false,
            children: [
              "/fr/start/installation",
              "/fr/start/demos"
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
                  "/en/graphql/start/introduction",
                  "/en/graphql/start/installation",
                  "/en/graphql/start/bootstrap"
                ]
              },
              {
                title: "Type definition",
                collapsable: false,
                children: [
                  "/en/graphql/type/type-definition",
                  "/en/graphql/type/inheritance",
                  "/en/graphql/type/generics",
                  "/en/graphql/type/interfaces",
                  "/en/graphql/type/unions",
                  "/en/graphql/type/enums",
                  "/en/graphql/type/scalars"
                ]
              },
              {
                title: "Networking & Queries",
                collapsable: false,
                children: [
                  "/en/graphql/query/resolvers",
                  "/en/graphql/query/middlewares",
                  "/en/graphql/query/subscriptions"
                ]
              },
              {
                title: "Misc",
                collapsable: false,
                children: [
                  "/en/graphql/misc/write-schema"
                ]
              }
            ]
          },
          {
            title: "REST",
            collapsable: true,
            children: [
              "/fr/rest/router",
              "/fr/rest/middlewares",
              "/fr/rest/koa-middlewares",
              "/fr/rest/serving-static-files"
            ]
          },
          {
            title: "Websocket",
            collapsable: true,
            children: [
              "/fr/ws/introduction",
              "/fr/ws/server-side",
              "/fr/ws/client-side"
            ]
          },
          {
            title: "DI",
            collapsable: true,
            children: [
              "/fr/di/introduction",
              "/fr/di/services-and-injections",
              "/fr/di/inheritance",
              "/fr/di/api",
              "/fr/di/limitations"
            ]
          },
          {
            title: "API",
            collapsable: true,
            children: [
              "/fr/api/metadata-storage",
              "/fr/api/rakkit"
            ]
          },
          {
            title: "Développement",
            collapsable: true,
            children: [
              "/fr/dev/contributing",
              "/fr/dev/changelog"
            ]
          }
        ]
      }
    }
  }
}
