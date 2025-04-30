const transactionRepository = require("../repositories/transactionRepository");
const responseFormatter = require("../utils/responseFormatter");

const createTransaction = async (req, res) => {
  try {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id || !quantity || !user_id) {
      return res
        .status(400)
        .json(responseFormatter.error("Missing required fields"));
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json(responseFormatter.error("Quantity must be larger than 0"));
    }

    const transaction = await transactionRepository.createTransaction(
      item_id,
      quantity,
      user_id
    );
    res
      .status(201)
      .json(responseFormatter.success("Transaction created", transaction));
  } catch (error) {
    console.error("Error in createTransaction:", error);
    res.status(500).json(responseFormatter.error("Error creating transaction"));
  }
};

const payTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionRepository.payTransaction(id);

    if (!transaction) {
      return res.status(400).json(responseFormatter.error("Failed to pay"));
    }

    res.json(responseFormatter.success("Payment successful", transaction));
  } catch (error) {
    console.error("Error in payTransaction:", error);
    res.status(500).json(responseFormatter.error("Error processing payment"));
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionRepository.deleteTransaction(id);

    if (!transaction) {
      return res
        .status(404)
        .json(responseFormatter.error("Transaction not found"));
    }

    res.json(responseFormatter.success("Transaction deleted", transaction));
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    res.status(500).json(responseFormatter.error("Error deleting transaction"));
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transaction = await transactionRepository.getAll();
    res.json(responseFormatter.success("transactions found", transaction));
  } catch (error) {
    res
      .status(500)
      .json(responseFormatter.error("Error fetching transactions"));
  }
};

module.exports = {
  createTransaction,
  payTransaction,
  deleteTransaction,
  getAllTransactions,
};