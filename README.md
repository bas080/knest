# Knest
[![Build Status](https://travis-ci.org/bas080/knest.svg?branch=master)](https://travis-ci.org/bas080/knest)

Enable rollback for your tests that use **knex**.

Knest works with most test frameworks out there.

# Installation

`npm install knest --save-dev`

# Usage

> Example using mocha as the testing framework

This example is part of the knex mocha [tests](./index.mocha.spec.js). They
can be run using using the following npm script.

```bash
npm install npx -g && npx mocha ./index.mocha.spec.js
```

```js
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

describe('Mocha & Knest', () => {
  it('should reset the database user table', () => resetDatabase(mysql))

  it('should create user in user table', () =>
    knest(trx =>
      createUser(trx, users[0]).then(record =>
        assert.deepEqual(record, users[0])
      )
    ))

  it('should create users using multiple transactions', () =>
    knest(trx => createUsers(trx, users)))

  it('should have rolled back all the insert queries', () =>
    findUsers(mysql).then(result => assert.deepEqual(result, [])))

  after(() => process.exit())
})
```

You can consider using `async / await` syntax as the knex helper returns
a promise.

```bash
node index.async.spec.js
```

```js
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
```

# Reference

Knest exports a single function.

## knest(knexConnection, testFn)

What Knest basically does is wrap the test function and adds a knex transaction as
the first argument of the test callback function.

**returns** a promise which will rollback the transaction when it resolves.
This is required. Throws if a promise is not returned.

### knexConnection

This value should be
a [knex-connection](http://knexjs.org/#Installation-client) or a knex
transaction object.

### testFn(knexTransaction)

The testFn is called when the tests are run. It is called with the following
arguments

**knexTransaction** is an instance of a knex transaction that uses the
previously configured knex connection.


# Test

Knest is tested using MySQL. Make sure you have MySQL installed. The
`./setup.sql` file makes it easy to setup a database and user for running the
tests.

```bash
#!/bin/bash

npm install
sudo mysql -p < ./setup.sql
```

Once the test requirements are setup you can run the tests using `npm test`

# Changelog

## 1.1.0

- Support native promises by not using the tap method on a promise.

## 1.0.0

- Simpler function signature for test fn. Use a separate function definition
  for your test fn and your transaction function. See
  [reference](./doc/section/reference.md)

# Contribute

Some suggestions for contributing to this library are:

- Use this library for your knex related tests.
- Write tests that use different test frameworks.
- Write tests for other databases knex supports.
- Support for multiple connections/transactions
- Contribute what you feel is important.

# License

[MIT License](./LICENSE)
