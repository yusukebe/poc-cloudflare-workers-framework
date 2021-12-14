const Hono = require('./src/hono')
const app = new Hono()

app.get('/', () => 'root')

//app.get('/hello', () => new Response('Hello!'))

//app.fire()
