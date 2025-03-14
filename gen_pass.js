const bcrypt = require('bcrypt'),
  crypto = require('crypto')

const email = 'customer@gmail.com'
const passwd = 'password'

let salt = bcrypt.genSaltSync(10)

let emailHash = crypto.createHash('sha256').update(email).digest('hex')
let passwdHash = crypto.createHash('sha256').update(passwd).digest('hex')
let toBeHashed = [emailHash, passwdHash].join('+');

let hash = bcrypt.hashSync(toBeHashed, salt)

console.log(hash)

