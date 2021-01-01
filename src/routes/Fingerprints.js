const express = require('express')
const DatabaseService = require('../services/DatabaseService')

const Fingerprints = express.Router()

Fingerprints
  .route('/')
  .all((req, res, next) => {
    if (!req.body.identifier) {
      return res.status(400).json({ message: 'Identifier is required' })
    }
    next()
  })
  .post(async (req, res, next) => {
    try {
      await DatabaseService.resetFingerprint(req.app.get('db'), req.body.identifier)
      const fp = await DatabaseService.getFingerprint(req.app.get('db'), req.body.identifier)
      res.status(200).json(fp)
    } catch (error) {
      next(error)
    }
  })
  .put(async (req, res, next) => {
    try {
      if (!req.body.action) {
        return res.status(400).json({ message: 'Action is required' })
      }
      let fp = {}
      if (req.body.action === 'reset') {
        fp = await DatabaseService.resetFingerprint(req.app.get('db'), req.body.identifier)
      }
      else if (req.body.action === 'increment') {
        fp = await DatabaseService.incrementUsage(req.app.get('db'), req.body.identifier)
      }
      res.status(200).json(fp)
    } catch (error) {
      next(error)
    }
  })

module.exports = Fingerprints