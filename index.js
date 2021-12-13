const App = require('./src/app.js')

App.get('/hello', () => {
  return new Response('/hello', {
    status: 200
  })
})

addEventListener("fetch", event => App.handle(event))