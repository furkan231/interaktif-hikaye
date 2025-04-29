const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "fener23"; // Şifreyi buraya yazın
  const hashedPassword = await bcrypt.hash(password.trim(), 10); // Şifreyi hashle
  console.log("Yeni hash:", hashedPassword); // Oluşan hash'i konsola yazdır
}

generateHash();
