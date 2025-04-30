const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

module.exports = db;
