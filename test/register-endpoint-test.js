const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Register Endpoint', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  before('create user and fingerprint tables', () => helpers.createTables(db))

  after('drop user and fingerprint tables', () => helpers.dropTables(db))

  after('disconnect from db', () => db.destroy())

  it('No email sent - POST /api/register', () => {
    const postData = { ...helpers.registerData }
    delete postData.email
    return supertest(app)
      .post('/api/register')
      .send(postData)
      .expect(400, { message: 'Email is required' })
  })

  it('Wrong length password - POST /api/register', () => {
    const postData = { ...helpers.registerData }
    postData.password = 123
    return supertest(app)
      .post('/api/register')
      .send(postData)
      .expect(400, { message: 'Password must be between 6 and 72 characters' })
  })

  it('POST /api/register', () => {
    return supertest(app)
      .post('/api/register')
      .send(helpers.registerData)
      .expect(201)
  })

  it('User already exists - POST /api/register', () => {
    return supertest(app)
      .post('/api/register')
      .send(helpers.registerData)
      .expect(400, { message: 'User already exists' })
  })

  it('verify user created in database', () => {
    return db('users').where('email', helpers.registerData.email).first()
      .then(res => {
        expect(res).to.eql({
          first_name: helpers.registerData.fname,
          last_name: helpers.registerData.lname,
          email: helpers.registerData.email,
          pw: res.pw,
          id: 1
        })
      })
  })

  it('verify fingerprint created in database', () => {
    return db('fingerprints').where('identifier', helpers.registerData.email).first()
      .then(res => {
        expect(res).to.eql({
          max_per_hour: 5,
          current_usage: 0,
          next_reset: res.next_reset,
          identifier: helpers.registerData.email,
          id: 1
        })
      })
  })

})