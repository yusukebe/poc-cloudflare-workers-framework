const Hono = require('./src/hono.js')
const app = new Hono()

app.get('/hello', () => {
  return new Response('Hello!', {
    status: 200
  })
})

app.fire()
