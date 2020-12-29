module.exports = {
  addUser(db, userData) {
    return db('users').insert(userData)
  },
  getUser(db, email) {
    return db('users').where({ email }).first()
  }
}