'use strict'

const rolledBackAfterSuccess = {}

function knest(connection, testFn) {
  return function knest(...libArgs) {
    return connection
      .transaction(trx => {
        try {
          testFn(trx, ...libArgs).tap(
            () => trx.rollback(rolledBackAfterSuccess),
            trx.rollback
          )
        } catch (error) {
          trx.rollback(error)
        }
      })
      .catch(e => {
        if (e !== rolledBackAfterSuccess) console.error(e)
      })
  }
}

module.exports = knest
