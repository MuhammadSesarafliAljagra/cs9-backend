const db = require("../database/db"); // Menggunakan Knex.js

exports.getAllItems = async () => {
  return await db("items").select("*");
};

exports.createItem = async (name, price, store_id, image_url, stock) => {
  return await db("items")
    .insert({ name, price, store_id, image_url, stock })
    .returning("*");
};

exports.getItemById = async (id) => {
  return await db("items").where({ id }).first();
};

exports.getItemsByStore = async (store_id) => {
  return await db("items").where({ store_id }).select("*");
};

exports.updateItem = async (id, name, price, store_id, image_url, stock) => {
  const updated = await db("items")
    .where({ id })
    .update({ name, price, store_id, image_url, stock })
    .returning("*"); // ✅ Pastikan ini ada!

  return updated.length ? updated[0] : null;
};

exports.deleteItem = async (id) => {
  const deleted = await db("items").where({ id }).del().returning("*");
  return deleted.length ? deleted[0] : null;
};
