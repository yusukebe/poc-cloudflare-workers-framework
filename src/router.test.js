const Router = require('./router')

const router = new Router()

router.add('/', 'root')

test('root match', () => {
  let match = router.match('/')
  expect(match).not.toBeNull()
  expect(match[0]).toBe('root')
  match = router.match('/foo')
  expect(match).toBeNull()
  match = router.match('/hello')
  expect(match[0]).toBe('hello')
})

router.add('/hello', 'hello')
router.add('/entry/:id', 'entry-id')
router.add('/entry/:id/:comment', 'entry-id-comment')
router.add('/year/:year{[0-9]{4}}/:month{[0-9]{2}}', 'date-regex')

test('entry id match', () => {
  const match = router.match('/entry/123')
  expect(match[0]).toBe('entry-id')
  expect(match[1]['id']).toBe('123')
})

test('entry id and comment match', () => {
  const match = router.match('/entry/123/45678')
  expect(match[0]).toBe('entry-id-comment')
  expect(match[1]['id']).toBe('123')
  expect(match[1]['comment']).toBe('45678')
})

test('date-regex', () => {
  const match = router.match('/year/2021/12')
  expect(match[0]).toBe('date-regex')
  expect(match[1]['year']).toBe('2021')
  expect(match[1]['month']).toBe('12')
})

test('not match', () => {
  let match = router.match('/foo')
  expect(match).toBeNull()
  match = router.match('/year/abc')
  expect(match).toBeNull()
}) 