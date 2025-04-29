// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // 'bcryptjs' kullanın

// Kullanıcı şeması (Schema)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Lütfen geçerli bir e-posta adresi girin"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Şifreyi kaydetmeden önce şifreyi hashlemek için bir 'pre' middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Eğer şifre değişmemişse işlemi atla
  try {
    this.password = await bcrypt.hash(this.password, 10); // Şifreyi hashle
    next();
  } catch (error) {
    next(error); // Hata oluşursa bir sonraki aşamaya geç
  }
});

// Şifre karşılaştırma fonksiyonu
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Giriş şifresi ile veritabanındaki şifreyi karşılaştır
};

// Modeli oluştur ve dışa aktar
const User = mongoose.model("User", userSchema);

module.exports = User;
