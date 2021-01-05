const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Fingerprint Endpoints', () => {
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

  it('POST /api/fingerprint returns 400 if no identfier in body', () => {
    return supertest(app)
      .post('/api/fingerprints')
      .expect(400, { message: 'Identifier is required' })
  })

  it('POST /api/fingerprint returns 200 and fingerprint object', () => {
    return supertest(app)
      .post('/api/fingerprints')
      .send({ identifier: 'test' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('current_usage')
        expect(res.body.current_usage).to.equal(0)
        expect(res.body).to.have.property('id')
        expect(res.body.id).to.equal(1)
        expect(res.body).to.have.property('identifier')
        expect(res.body.identifier).to.equal('test')
        expect(res.body).to.have.property('max_per_hour')
        expect(res.body.max_per_hour).to.equal(2)
        expect(res.body).to.have.property('next_reset')
        expect(res.body.next_reset).to.be.a('string')
      })
  })

  it('PUT /api/fingerprint returns 400 if no identfier in body', () => {
    return supertest(app)
      .put('/api/fingerprints')
      .expect(400, { message: 'Identifier is required' })
  })

  it('PUT /api/fingerprint returns 400 if no action in body', () => {
    return supertest(app)
      .put('/api/fingerprints')
      .send({ identifier: 'test' })
      .expect(400, { message: 'Action is required' })
  })

  it('PUT /api/fingerprint returns 200 and incremented fingerprint object', () => {
    return supertest(app)
      .put('/api/fingerprints')
      .send({ identifier: 'test', action: 'increment' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('current_usage')
        expect(res.body.current_usage).to.equal(1)
        expect(res.body).to.have.property('id')
        expect(res.body.id).to.equal(1)
        expect(res.body).to.have.property('identifier')
        expect(res.body.identifier).to.equal('test')
        expect(res.body).to.have.property('max_per_hour')
        expect(res.body.max_per_hour).to.equal(2)
        expect(res.body).to.have.property('next_reset')
        expect(res.body.next_reset).to.be.a('string')
      })
  })

  it('PUT /api/fingerprint returns 200 and same fingerprint object because before reset time', () => {
    return supertest(app)
      .put('/api/fingerprints')
      .send({ identifier: 'test', action: 'reset' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('current_usage')
        expect(res.body.current_usage).to.equal(1)
        expect(res.body).to.have.property('id')
        expect(res.body.id).to.equal(1)
        expect(res.body).to.have.property('identifier')
        expect(res.body.identifier).to.equal('test')
        expect(res.body).to.have.property('max_per_hour')
        expect(res.body.max_per_hour).to.equal(2)
        expect(res.body).to.have.property('next_reset')
        expect(res.body.next_reset).to.be.a('string')
      })
  })

})