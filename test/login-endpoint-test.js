const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Login Endpoint', () => {
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

  before('create user', () => {
    return helpers.createUser(db)
  })

  after('disconnect from db', () => db.destroy())

  it('POST /api/login', () => {
    const postData = {
      email: 'bd@123.com',
      password: 'password'
    }
    return supertest(app)
      .post('/api/login')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body).to.have.property('token')
        expect(res.body.token).to.be.a('string')
      })
  })

  it('No email sent - POST /api/login', () => {
    const postData = {
      password: 'password'
    }
    return supertest(app)
      .post('/api/login')
      .send(postData)
      .expect(400, { message: `Email is required` })
  })

  it('No password sent - POST /api/login', () => {
    const postData = {
      email: 'jd@123.com'
    }
    return supertest(app)
      .post('/api/login')
      .send(postData)
      .expect(400, { message: `Password is required` })
  })

  it('Wrong password sent - POST /api/login', () => {
    const postData = {
      email: 'jd@123.com',
      password: 'wrong'
    }
    return supertest(app)
      .post('/api/login')
      .send(postData)
      .expect(401, { message: 'Username or password is incorrect' })
  })

  it('Wrong email sent - POST /api/login', () => {
    const postData = {
      email: 'wrong@123.com',
      password: 'password'
    }
    return supertest(app)
      .post('/api/login')
      .send(postData)
      .expect(401, { message: 'Username or password is incorrect' })
  })

})