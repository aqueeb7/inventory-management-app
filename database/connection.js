const knex = require('knex')
const knexConfig = require('./knexfile')
const EventEmitter = require('events')
const logger = require('../src/helpers/logger')


// Event emitter for database events

class DatabaseEmitter extends EventEmitter { }
const dbEmitter = new DatabaseEmitter()


// Create a new knex instane
const db = knex(knexConfig[process.env.NODE_ENV || 'development'])

// handle database disconnects
db.client.pool.on('destroy', () => {
  logger.error('[DATABASE] connection destroyed')
  dbEmitter.emit('disconnected')
})

// TEST CONNECTION
db.raw('SELECT 1+1 as result').then(() => {
  logger.info('[DATABASE] connection established');
}).catch(err => {
  logger.error('[DATABASE] connection failed');
  logger.error(err);
  dbEmitter.emit('disconnected');
});

module.exports = { db, dbEmitter }