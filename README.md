# Knest

[![NPM Downloads](https://img.shields.io/npm/dm/knest?style=flat-square)](https://www.npmjs.com/package/knest)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/knest?style=flat-square)](https://snyk.io/vuln/npm:knest)
[![Standard Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/knest?color=brightgreen&style=flat-square)](./LICENSE)

Enable rollback for your tests that use **knex**.

Knest works with most test frameworks out there.

# Installation

`npm install knest --save-dev`

# Usage

> Example using mocha as the testing framework

This example is part of the knex mocha [tests](./index.mocha.spec.js). They
can be run using the following npm script.

```js
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


# Tests

Knest is tested using MySQL. Make sure you have MySQL installed. The
`./setup.sql` file makes it easy to setup a database and user for running the
tests.

```bash
sudo mysql -p < setup.sql
```

Then install, prune and run the tests.

```bash bash
{ npm i && npm prune; } > /dev/null
npm t
```
```

> knest@1.1.3 test
> npx standard && npm run test-tape && npm run test-mocha


> knest@1.1.3 test-tape
> tape index.tape.spec.js

TAP version 13
# should reset the database user table
# should create user in user table
ok 1 should be loosely deeply equivalent
# should create users using multiple transactions
# should have rolled back all the insert queries
ok 2 should be loosely deeply equivalent

1..2
# tests 2
# pass  2

# ok


> knest@1.1.3 test-mocha
> mocha index.mocha.spec.js



  Mocha & Knest
    ✔ should reset the database user table (115ms)
    ✔ should create user in user table
    ✔ should create users using multiple transactions
    ✔ should have rolled back all the insert queries
```

# Contribute

Feel free to contribute in whatever way you deem to be valuable.

Read more in the [CONTRIBUTING.md](./CONTRIBUTING.md)

# License

[MIT](../../LICENSE)
