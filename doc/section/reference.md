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

