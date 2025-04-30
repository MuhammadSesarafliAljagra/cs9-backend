const userRepository = require("../repositories/userRepository");
const responseFormatter = require("../utils/responseFormatter");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.query;

    // Validasi regex untuk email dan password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Minimal 6 karakter, harus ada huruf dan angka

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json(responseFormatter.error("Invalid email format"));
    }
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json(
          responseFormatter.error(
            "Password must be at least 6 characters, including letters and numbers"
          )
        );
    }

    // Existence check
    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json(responseFormatter.error("Email already registered"));
    }

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).json(responseFormatter.success("User created", newUser));
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json(responseFormatter.error("Error creating user"));
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.query;

    // Cari user berdasarkan email
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json(responseFormatter.error("Invalid credentials"));
    }

    // Bandingkan password yang diberikan dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(responseFormatter.error("Invalid credentials"));
    }

    res.json(responseFormatter.success("User logged in", user));
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json(responseFormatter.error("Error logging in"));
  }
};


const getUserByEmail = async (req, res) => {
  try {
    const user = await userRepository.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).json(responseFormatter.error("User not found"));
    }
    res.json(responseFormatter.success("User found", user));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error fetching user"));
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, email, password, name } = req.body;

    // Validasi regex untuk email dan password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;


    if (email && !emailRegex.test(email)) {
      return res
        .status(400)
        .json(responseFormatter.error("Invalid email format"));
    }
    if (password && !passwordRegex.test(password)) {
      return res
        .status(400)
        .json(
          responseFormatter.error(
            "Password must be at least 6 characters, including letters and numbers"
          )
        );
    }

    // Jika ada password baru, lakukan hashing sebelum update
    const updatedData = { id, email, name };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userRepository.update(updatedData);
    if (!updatedUser) {
      return res.status(404).json(responseFormatter.error("User not found"));
    }
    res.json(responseFormatter.success("User updated", updatedUser));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error updating user"));
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userRepository.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json(responseFormatter.error("User not found"));
    }
    res.json(responseFormatter.success("User deleted", deleted));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error deleting user: " + error));
  }
};

const topUpBalances = async (req, res) => {
  try {
    const { id, amount } = req.query;

    // Validasi input
    if (!id || !amount) {
      return res
        .status(400)
        .json(responseFormatter.error("Missing required fields"));
    }

    const amountValue = parseInt(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return res
        .status(400)
        .json(responseFormatter.error("Amount must be larger than 0"));
    }

    // Cek apakah user ada di database
    const user = await userRepository.getById(id);
    if (!user) {
      return res.status(404).json(responseFormatter.error("User not found"));
    }

    // Lakukan top-up saldo
    const updatedUser = await userRepository.topUp(id, amountValue);

    res.json(responseFormatter.success("Top up successful", updatedUser));
  } catch (error) {
    console.error("Error in topUpBalance:", error);
    res.status(500).json(responseFormatter.error("Error processing top up"));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  topUpBalances,
};