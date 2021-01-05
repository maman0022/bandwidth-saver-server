module.exports = {
  async createTables(db) {
    await db.transaction(trx => {
      return trx.schema.createTable('users', table => {
        table.increments('id').notNullable()
        table.text('first_name').notNullable()
        table.text('last_name').notNullable()
        table.text('email').unique().notNullable()
        table.text('pw').notNullable()
      }).createTable('fingerprints', table => {
        table.increments('id').notNullable()
        table.text('identifier').notNullable()
        table.integer('max_per_hour').notNullable()
        table.integer('current_usage').notNullable()
        table.bigInteger('next_reset').notNullable()
      })
    })
  },
  async dropTables(db) {
    await db.schema.dropTableIfExists('users').dropTableIfExists('fingerprints')
    await db.schema.dropTableIfExists('fingerprints')
  }
}