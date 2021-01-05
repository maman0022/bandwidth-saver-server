const bcrypt = require('bcryptjs')

module.exports = {
  registerData: {
    fname: 'Bob',
    lname: 'Dole',
    email: 'bd@123.com',
    password: 'password'
  },
  userData: {
    first_name: 'Bob',
    last_name: 'Dole',
    email: 'bd@123.com'
  },
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
  },
  async createUser(db) {
    const pw = await bcrypt.hash('password', 10)
    await db('users').insert({ ...this.userData, pw })
  }
}