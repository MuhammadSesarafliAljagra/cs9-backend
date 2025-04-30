const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");

router.post("/create", transactionController.createTransaction);
router.post("/pay/:id", transactionController.payTransaction);
router.delete("/:id", transactionController.deleteTransaction);
router.get("/", transactionController.getAllTransactions);

module.exports = router;
