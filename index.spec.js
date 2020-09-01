const mysql = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'knest',
    password: 'knest',
    database: 'knest'
  }
})
const users = [
  { name: 'Jerry', email: 'jerry@example.com' },
  { name: 'Tom', email: 'tom@example.com' },
  { name: 'Jim', email: 'jim@example.com' }
]

function createUser (trx, user) {
  return trx('users')
    .insert(user)
    .then(() => findUser(trx, user))
}

function createUsers (trx, users) {
  return trx.transaction(trx =>
    Promise.all(users.map(user => createUser(trx, user)))
  )
}

function findUser (trx, user) {
  return trx('users')
    .where(user)
    .first('name', 'email')
}

function findUsers (trx) {
  return trx('users').select('name', 'email')
}

function resetDatabase (connection) {
  return connection.schema.dropTableIfExists('users').then(() =>
    connection.schema.createTable('users', table => {
      table.string('name')
      table.string('email')
      table.unique('email')
    })
  )
}

module.exports = {
  resetDatabase,
  createUser,
  createUsers,
  findUsers,
  findUser,
  users,
  mysql
}
