const db = require("../database/db");

exports.getAll = async () => {
  return await db("stores").select("*");
};

exports.create = async (store) => {
  return await db("stores").insert(store).returning("*");
};

exports.getById = async (id) => {
  return await db("stores").where({ id }).first();
};

exports.update = async (store) => {
  const updated = await db("stores").where({ id: store.id }).update({
    name: store.name,
    address: store.address,
  });

  return updated ? store : null;
};

exports.delete = async (id) => {
  const deleted = await db("stores").where({ id }).del();
  return deleted ? { id } : null;
};
