module.exports = {
  addUser(db, userData) {
    return db('users').insert(userData)
  },
  getUser(db, email) {
    return db('users').where({ email }).first()
  },
  addFingerprint(db, data) {
    return db('fingerprints').insert(data)
  },
  getFingerprint(db, identifier) {
    return db('fingerprints').where({ identifier }).first()
  },
  async resetFingerprint(db, identifier) {
    const t = Date.now()
    const fp = await this.getFingerprint(db, identifier)
    if (t > Number(fp.next_reset)) {
      return db('fingerprints').where({ id: fp.id, identifier }).update({ next_reset: t + 90000, current_usage: 0 }).returning('*').then(rows => rows[0])
    }
  },
  incrementUsage(db, identifier) {
    return db('fingerprints').where({ identifier }).increment('current_usage', 1).returning('*').then(rows => rows[0])
  }
}