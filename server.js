// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");
const Story = require("./models/Story");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware'ler
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my_database_name",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz erişim!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token!" });
  }
};

// Kayıt Rotası
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "E-posta zaten kullanılıyor!" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    console.log("Yeni kullanıcı kaydedildi:", email);
    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (error) {
    console.error("Kayıt sırasında hata:", error);
    res.status(500).json({ message: "Kayıt sırasında bir hata oluştu." });
  }
});

// Giriş Rotası
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "E-posta ve şifre gereklidir." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const isMatch = await user.comparePassword(password);

    console.log("Şifre eşleşme durumu:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Geçersiz şifre." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Giriş başarılı!", token });
  } catch (error) {
    console.error("Giriş sırasında hata:", error);
    res.status(500).json({ message: "Giriş sırasında bir hata oluştu." });
  }
});

// Dashboard Rotası
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "/dashboard.html"));
});

// Story Detay Rotası
app.get("/story.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/story.html"));
});

// Hikaye ekleme rotası (korumalı)
app.post("/api/stories", authMiddleware, async (req, res) => {
  try {
    const { title, scenes, startScene, imageUrl } = req.body;
    const author = req.user; // Token'dan alınan kullanıcı ID'si

    const newStory = new Story({
      title,
      author,
      scenes,
      startScene,
      imageUrl, // Yeni eklenen alan
    });

    const savedStory = await newStory.save();

    res.status(201).json(savedStory);
  } catch (error) {
    console.error("Hikaye ekleme hatası:", error);
    res.status(500).json({ message: "Hikaye eklenirken bir hata oluştu." });
  }
});

// Tüm hikayeleri listeleme rotası (genel)
app.get("/api/stories", async (req, res) => {
  try {
    const stories = await Story.find().populate("author", "username email");

    res.json(stories);
  } catch (error) {
    console.error("Hikayeleri getirirken hata:", error);
    res.status(500).json({ message: "Hikayeler alınırken bir hata oluştu." });
  }
});

// Belirli bir hikayeyi getirme rotası (genel)
app.get("/api/stories/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!story) {
      return res.status(404).json({ message: "Hikaye bulunamadı." });
    }
    res.json(story);
  } catch (error) {
    console.error("Hikayeyi getirirken hata:", error);
    res.status(500).json({ message: "Hikaye alınırken bir hata oluştu." });
  }
});

// Belirli bir hikayede belirli bir sahneyi getirme rotası (genel)
app.get("/api/stories/:id/scenes/:sceneId", async (req, res) => {
  try {
    const { id, sceneId } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Hikaye bulunamadı." });
    }

    const scene = story.scenes.find((s) => s.sceneId === sceneId);
    if (!scene) {
      return res.status(404).json({ message: "Sahne bulunamadı." });
    }

    res.json(scene);
  } catch (error) {
    console.error("Sahneyi getirirken hata:", error);
    res.status(500).json({ message: "Sahne alınırken bir hata oluştu." });
  }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(
  cors({
    origin: "http://localhost:5500", // Frontend'inizin çalıştığı domain ve port
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
