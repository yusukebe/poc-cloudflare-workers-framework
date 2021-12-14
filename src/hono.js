const Router = require('./router')

function Route(method, handler) {
  this.method = method;
  this.handler = handler;
}

function App() {
  this.router = new Router();

  this.addRoute = (method, path, handler) => {
    this.router.add(path, new Route(method, handler))
  };

  this.handle = (event) => {
    const response = this.dispatch(event.request)
    return event.respondWith(response)
  };

  this.dispatch = (request) => {
    const url = new URL(request.url)
    const path = url.pathname
    const match = this.router.match(path)

    if (!match) {
      return this.notFound()
    }

    const method = request.method.toLowerCase()
    const route = match[0]
    if (route.method == method) {
      const handler = route.handler
      return handler()
    }
    return this.notFound()
  };

  this.notFound = () => {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain'
      }
    })
  };

  this.fire = () => {
    addEventListener("fetch", (event) => {
      this.handle(event)
    })
  }
}

const proxyHandler = {
  get: (target, prop, receiver) => (...args) => {
    if (target.hasOwnProperty(prop)) {
      if (prop == 'handle') {
        return target.handle(args[0])
      }
      if (prop == 'fire') {
        return target.fire()
      }
    } else {
      target.addRoute(prop, args[0], args[1])
      return
    }
  }
}

const app = new App()
const hono = new Proxy(app, proxyHandler)

module.exports = hono