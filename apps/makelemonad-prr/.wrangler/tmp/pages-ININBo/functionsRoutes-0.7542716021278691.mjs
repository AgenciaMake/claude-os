import { onRequestGet as __api_data__mes__js_onRequestGet } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/data/[mes].js"
import { onRequestOptions as __api_data__mes__js_onRequestOptions } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/data/[mes].js"
import { onRequestPut as __api_data__mes__js_onRequestPut } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/data/[mes].js"
import { onRequestOptions as __api_auth_js_onRequestOptions } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/auth.js"
import { onRequestPost as __api_auth_js_onRequestPost } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/auth.js"
import { onRequestGet as __api_realtime_js_onRequestGet } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/realtime.js"
import { onRequestOptions as __api_realtime_js_onRequestOptions } from "/Users/brunomartins/Desktop/CCode/ccos-make/apps/makelemonad-prr/functions/api/realtime.js"

export const routes = [
    {
      routePath: "/api/data/:mes",
      mountPath: "/api/data",
      method: "GET",
      middlewares: [],
      modules: [__api_data__mes__js_onRequestGet],
    },
  {
      routePath: "/api/data/:mes",
      mountPath: "/api/data",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_data__mes__js_onRequestOptions],
    },
  {
      routePath: "/api/data/:mes",
      mountPath: "/api/data",
      method: "PUT",
      middlewares: [],
      modules: [__api_data__mes__js_onRequestPut],
    },
  {
      routePath: "/api/auth",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_js_onRequestOptions],
    },
  {
      routePath: "/api/auth",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_js_onRequestPost],
    },
  {
      routePath: "/api/realtime",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_realtime_js_onRequestGet],
    },
  {
      routePath: "/api/realtime",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_realtime_js_onRequestOptions],
    },
  ]