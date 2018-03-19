const times = require("lodash.times")
const test = require("tape")
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "knest",
    password: "knest",
    database: "knest"
  }
})

const knest = require("./index").bind(null, knex)

test.onFinish(() => process.exit())

test("setup", t => {
  const records = times(12000, i => ({
    name: `name${i}`,
    email: `${i}@example.com`
  }))

  knex.schema
    .dropTableIfExists("users")
    .then(() =>
      knex.schema.createTable("users", table => {
        table.string("name")
        table.string("email")
        table.unique("email")
      })
    )
    .then(() => knex("users").insert(records))
    .then(() => knex("users").select(["name", "email"]))
    .then(result => t.deepEquals(result, records))
    .then(() => t.end())
    .catch(t.fail)
})

const user = {
  name: "Jerry",
  email: "jerry@example.com"
}

test(
  "adds a user within a transaction",
  knest((trx, t) => {
    return createUser(trx, user)
      .then(() => findUser(trx, user))
      .then(record => t.deepEqual(record, user))
      .then(() => t.end())
  })
)

test(
  "if user is no longer in the users table",
  knest((trx, t) => {
    return findUser(trx, user)
      .then(found => t.equal(found, undefined))
      .then(() => t.end())
  })
)

test(
  "knex supports nested transactions",
  knest((trx, t) => {
    const users = [
      { name: "Tom", email: "tom@example.com" },
      { name: "Jim", email: "jim@example.com" }
    ]

    return createUsers(trx, users).then(() => t.end())
  })
)

test("adding of users was rolled back", t => {
  knex("users")
    .count("name as count")
    .then(([{ count }]) => t.equal(count, 12000))
    .then(() => t.end())
})

function createUser(trx, user) {
  return trx("users").insert(user)
}

function findUser(trx, user) {
  return trx("users")
    .where(user)
    .first("name", "email")
}

function createUsers(trx, users) {
  return trx.transaction(trx =>
    Promise.all(users.map(user => createUser(trx, user)))
  )
}
