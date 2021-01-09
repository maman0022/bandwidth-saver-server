module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '03fcc06b-cc5c-46ee-9379-3a0920%$454f1e60e',
  RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET || ''
}