const app = require('./app')
const { PORT, NODE_ENV, DATABASE_URL } = require('./config')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server is in ${NODE_ENV} mode & listening on port ${PORT}`)
})