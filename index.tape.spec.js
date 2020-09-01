const test = require('tape')
const {
  mysql,
  users,
  resetDatabase,
  findUsers,
  createUsers,
  createUser
} = require('./index.spec')

const knest = require('./index').bind(null, mysql)

test.onFinish(() => process.exit())

test('should reset the database user table', t => {
  resetDatabase(mysql)
    .then(() => t.end())
    .catch(t.end)
})

test('should create user in user table', t =>
  knest(trx => {
    const user = users[0]

    return createUser(trx, user)
      .then(record => t.deepLooseEqual(record, user))
      .then(() => t.end())
  }))

test('should create users using multiple transactions', t =>
  knest(trx => createUsers(trx, users).then(() => t.end())))

test('should have rolled back all the insert queries', t => {
  findUsers(mysql)
    .then(result => t.deepLooseEqual(result, []))
    .then(() => t.end())
})
