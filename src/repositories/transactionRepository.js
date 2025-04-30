const db = require("../database/db");

exports.createTransaction = async (item_id, quantity, user_id) => {
  const item = await db("items").where({ id: item_id }).first();
  if (!item) throw new Error("Item not found");

  const total = item.price * quantity;

  const [transaction] = await db("transactions")
    .insert({
      user_id,
      item_id,
      quantity,
      total,
      status: "pending",
    })
    .returning("*");

  return transaction;
};

exports.payTransaction = async (id) => {
  const transaction = await db("transactions").where({ id }).first();
  if (!transaction) return null;

  const user = await db("users").where({ id: transaction.user_id }).first();
  if (!user || user.balance < transaction.total) return null;

  await db("users")
    .where({ id: transaction.user_id })
    .update({ balance: user.balance - transaction.total });

  await db("items")
    .where({ id: transaction.item_id })
    .decrement("stock", transaction.quantity);

  const [updatedTransaction] = await db("transactions")
    .where({ id })
    .update({ status: "paid" })
    .returning("*");

  return updatedTransaction;
};

exports.deleteTransaction = async (id) => {
  const transaction = await db("transactions").where({ id }).first();
  if (!transaction) return null;

  await db("transactions").where({ id }).del();
  return transaction;
};

exports.getAll = async () => {
  return await db("transactions").select("*");
};