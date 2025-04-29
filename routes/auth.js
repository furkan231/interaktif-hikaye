// routes/auth.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Kayıt API'si
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kullanıcıyı bulma
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu e-posta zaten kullanılıyor." });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({ username, email, password });

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Kayıt başarılı", token });
  } catch (error) {
    res.status(500).json({ message: "Kayıt sırasında hata oluştu" });
  }
});

// Giriş API'si
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    // Şifreyi doğrula
    const isMatch = await user.comparePassword(password); // comparePassword olarak düzeltildi
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Giriş başarılı", token });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu" });
  }
});

module.exports = router;
