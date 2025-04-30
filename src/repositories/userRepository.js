const db = require("../database/db");

exports.create = async (user) => {
  console.log("Inserting user into database:", user);
  return await db("users").insert(user).returning("*");
};

exports.login = async (email, password) => {
  return await db("users").where({ email, password }).first();
};

exports.getByEmail = async (email) => {
  return await db("users").where({ email }).first();
};

exports.getById = async (id) => {
  return await db("users").where({ id }).first();
};

exports.update = async (user) => {
  const updated = await db("users").where({ id: user.id }).update({
    email: user.email,
    password: user.password,
    name: user.name,
  });

  return updated ? user : null;
};

exports.deleteUser = async (id) => {
  const deleted = await db("users").where({ id }).del();
  return deleted ? { id } : null;
};

exports.topUp = async (id, amount) => {
  const [updatedUser] = await db("users")
    .where({ id })
    .increment("balance", amount)
    .returning("*");

  return updatedUser;
};