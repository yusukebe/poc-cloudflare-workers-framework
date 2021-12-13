const app = {
  routes: [],
  handle(event) {
    const response = this.dispatch(event.request)
    return event.respondWith(response)
  },
  addRoute(method, path, handler) {
    this.routes.push({
      method: method,
      path: path,
      handler: handler
    })
  },
  dispatch(request) {
    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method.toLowerCase()
    for (const route of this.routes) {
      if (route.method == method) {
        if (route.path == path) {
          return route.handler()
        }
      }
    }
    return this.returnNotFound()
  },
  returnNotFound() {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain'
      }
    })
  }
}

const proxyHandler = {
  get: (target, prop, receiver) => (...args) => {
    if (target.hasOwnProperty(prop)) {
      if (prop == 'handle') {
        return target.handle(args[0])
      }
    } else {
      target.addRoute(prop, args[0], args[1])
      return
    }
  }
}

const App = new Proxy(app, proxyHandler)

module.exports = { App }