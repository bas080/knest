const assert = require('assert')
const {
  mysql,
  users,
  resetDatabase,
  findUsers,
  createUsers,
  createUser
} = require('./index.spec')
const knest = require('./index').bind(null, mysql)

describe('Mocha & Knest', () => {
  it('should reset the database user table', () => resetDatabase(mysql))

  it('should create user in user table', () =>
    knest(trx =>
      createUser(trx, users[0]).then(record => {
        assert.strictEqual(record.name, users[0].name)
        assert.strictEqual(record.email, users[0].email)
      })
    ))

  it('should create users using multiple transactions', () =>
    knest(trx => createUsers(trx, users)))

  it('should have rolled back all the insert queries', () =>
    findUsers(mysql).then(result => assert.deepStrictEqual(result, [])))

  after(() => process.exit())
})
