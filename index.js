'use strict'

const rolledBackAfterSuccess = {}

function knest (connection, testFn) {
  return connection
    .transaction(trx => {
      try {
        testFn(trx).then(
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

module.exports = knest
