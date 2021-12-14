const hono = require('./src/hono.js')

hono.get('/hello', () => {
  return new Response('Hello!', {
    status: 200
  })
})

hono.fire()
