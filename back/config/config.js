require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.USER || "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.USER || "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.USER || "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
