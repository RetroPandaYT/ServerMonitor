
module.exports = {
  client: 'mysql',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
  },
  pool: { min: 1, max: 1 }

}
