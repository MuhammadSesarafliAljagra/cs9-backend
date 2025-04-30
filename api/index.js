require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import paket CORS

const app = express();

// Middleware CORS
app.use(
  cors({
    origin: "*", // Izinkan semua domain (bisa diubah ke domain spesifik)
    methods: ["GET", "POST", "PUT", "DELETE"], // Izinkan metode tertentu
    allowedHeaders: ["Content-Type", "Authorization"], // Izinkan header tertentu
  })
);

app.use(express.json());
app.use("/store", require("../src/routes/storeRoute"));
app.use("/user", require("../src/routes/userRoute"));
app.use("/item", require("../src/routes/item.routes"));
app.use("/transaction", require("../src/routes/transactionRoute"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;