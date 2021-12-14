# poc-cloudflare-workers-framework

## Hono

```js
const Hono = require('./src/hono.js')
const app = new Hono()

app.get('/hello', () => {
  return new Response('Hello!', {
    status: 200,
  })
})

app.fire()
```

## Related projects

- <https://github.com/bmf-san/goblin>
- <https://github.com/kwhitley/itty-router>

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
