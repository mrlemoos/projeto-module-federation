const { exec } = require('child_process')

require('dotenv').config({
  path: '../../.env',
})

const { LIB_HOST, LIB_PORT } = process.env

exec(`serve -l tcp:${LIB_HOST}:${LIB_PORT} dist`)
