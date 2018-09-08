const assert = require('assert')
const {
  mysql,
  users,
  resetDatabase,
  findUsers,
  createUsers,
  createUser,
} = require('./index.spec')

const knest = require('./index').bind(null, mysql)

async function tests() {
  await resetDatabase(mysql)

  await knest(async trx => {
    const user = await createUser(trx, users[0])

    assert.deepEqual(user, users[0])
  })

  knest(async trx => {
    const created = await createUsers(trx, users)

    assert.deepEqual(created, users)
  })

  const foundUsers = await findUsers(mysql)

  assert.deepEqual(foundUsers, [])
}

tests().then(() => process.exit())
