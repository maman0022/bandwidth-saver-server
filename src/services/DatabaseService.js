module.exports = {
  addUser(db, userData) {
    return db('users').insert(userData).returning('*').then(rows => rows[0])
  },
  getUser(db, email) {
    return db('users').where({ email }).first()
  },
  addFingerprint(db, data) {
    return db('fingerprints').insert(data).returning('*').then(rows => rows[0])
  },
  getFingerprint(db, identifier) {
    return db('fingerprints').where({ identifier }).first()
  },
  async resetFingerprint(db, identifier) {
    const fp = await this.getFingerprint(db, identifier)
    //if fingerprint is not in database, create a free user and insert into database
    if (!fp) {
      const data = {
        identifier,
        max_per_hour: 2,
        current_usage: 0,
        next_reset: Date.now() + 3600000
      }
      return this.addFingerprint(db, data)
    }
    const t = Date.now()
    if (t > Number(fp.next_reset)) {
      return db('fingerprints').where({ id: fp.id, identifier }).update({ next_reset: t + 3600000, current_usage: 0 }).returning('*').then(rows => rows[0])
    }
    return fp
  },
  incrementUsage(db, identifier) {
    return db('fingerprints').where({ identifier }).increment('current_usage', 1).returning('*').then(rows => rows[0])
  }
}