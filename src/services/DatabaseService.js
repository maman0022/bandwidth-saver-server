module.exports = {
  addUser(db, userData) {
    return db('users').insert(userData)
  },
  getUser(db, email) {
    return db('users').where({ email }).first()
  },
  addDrive(db, driveData) {
    return db('drives').insert(driveData).returning('*').then(rows => rows[0])
  },
  getDrives(db, user_id) {
    return db('drives').where({ user_id })
  }
}