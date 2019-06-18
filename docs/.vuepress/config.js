module.exports = {
  title: "Rakkit",
  description: "A framework written in TypeScript that provides REST/GraphQL API and Websocket tools to build amazing server-side applications",
  lang: "en",
  locales: {
    "/": {
      lang: "en"
    },
    "/fr/": {
      lang: "fr",
      title: "Rakkit",
      description: "Un framework écrit en TypeScript qui permet de créer des API REST/GraphQL pour vos applications backend"
    },
  },
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
        sidebar: [{
            title: "Getting started",
            collapsable: false,
            children: [
              "/Installation",
              "/Demos"
            ]
          }, {
            title: "REST",
            collapsable: false,
            children: [
              "/Router",
              "/Middleware",
              "/MiddlewaresKoa",
              "/ServingStaticFiles"
            ]
          }, {
            title: "Websocket",
            collapsable: false,
            children: [
              "/Websocket"
            ]
          }, {
            title: "DI",
            collapsable: false,
            children: [
              "/DI"
            ]
          }, {
            title: "MetadataStorage",
            collapsable: false,
            children: [
              "/MetadataStorage",
              "/RakkitObject"
            ]
          }, {
            title: "Development",
            collapsable: false,
            children: [
              "/Contributing",
              "/Changelog"
            ]
          }
        ]
      },
      "/fr/": {
        editLinkText: "Editer cette page sur GitHub",
        sidebar: [{
            title: "Commencer",
            collapsable: false,
            children: [
              "/fr/Installation",
              "/fr/Demos"
            ]
          }, {
            title: "REST",
            collapsable: false,
            children: [
              "/fr/Router",
              "/fr/Middleware",
              "/fr/MiddlewaresKoa",
              "/fr/ServingStaticFiles"
            ]
          }, {
            title: "Websocket",
            collapsable: false,
            children: [
              "/fr/Websocket"
            ]
          }, {
            title: "DI",
            collapsable: false,
            children: [
              "/fr/DI"
            ]
          }, {
            title: "MetadataStorage",
            collapsable: false,
            children: [
              "/fr/MetadataStorage",
              "/fr/RakkitObject"
            ]
          }, {
            title: "Développement",
            collapsable: false,
            children: [
              "/fr/Contributing",
              "/en/Changelog"
            ]
          }
        ]
      }
    }
  }
}
