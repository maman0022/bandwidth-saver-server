const express = require('express')
const xss = require('xss')
const DatabaseService = require('../services/DatabaseService')

const Drives = express.Router()

function sanitizeDrive(drive) {
  return {
    id: drive.id,
    title: xss(drive.title),
    kind: drive.kind,
    user_id: drive.user_id
  }
}

Drives
  .route('/')
  .all((req, res, next) => {
    if (!req.user.id) {
      return res.status(401).json({ message: 'Unable to determine user. Please logout and log back in.' })
    }
    next()
  })
  .get((req, res, next) => {
    DatabaseService.getDrives(req.app.get('db'), req.user.id)
      .then(drives => {
        const sanitizedDrives = drives.map(sanitizeDrive)
        res.status(200).json(sanitizedDrives)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const requiredFields = { 'Title': 'title', 'Kind': 'kind' }
    for (const field in requiredFields) {
      if (!req.body[requiredFields[field]]) {
        return res.status(400).json({ message: `${field} is required` })
      }
    }
    if (req.body.kind !== 'dropbox' && req.body.kind !== 'onedrive') {
      return res.status(400).json({ message: 'Kind must be either "dropbox" or "onedrive"' })
    }
    const driveData = {
      title: req.body.title,
      kind: req.body.kind,
      user_id: req.user.id
    }
    DatabaseService.addDrive(req.app.get('db'), driveData)
      .then(drive => {
        res.status(201).json(sanitizeDrive(drive))
      })
      .catch(next)
  })

module.exports = Drives