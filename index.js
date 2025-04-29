// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Ortam değişkenlerini yükle
dotenv.config();

// Express app oluştur
const app = express();

// Middleware
app.use(express.json()); // JSON verilerini alabilmek için

// Veritabanı bağlantısını yap
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// API endpoints
app.get("/", (req, res) => {
  res.send("Merhaba, backend sunucusu çalışıyor!");
});

// Import routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); // /api/auth/ ile başlar

// Import Story modeli
const Story = require("./models/Story");

// Hikaye ekleme rotası
app.post("/api/stories", async (req, res) => {
  try {
    const { title, author, scenes, startScene } = req.body;

    // Yeni hikaye oluştur
    const newStory = new Story({
      title,
      author,
      scenes,
      startScene,
    });

    // Hikayeyi veritabanına kaydet
    const savedStory = await newStory.save();

    res.status(201).json(savedStory);
  } catch (error) {
    console.error("Hikaye ekleme hatası:", error);
    res.status(500).json({ message: "Hikaye eklenirken bir hata oluştu." });
  }
});

// Tüm hikayeleri listeleme rotası
app.get("/api/stories", async (req, res) => {
  try {
    const stories = await Story.find().populate("author", "username email"); // Yazar bilgilerini de alabilirsiniz
    res.json(stories);
  } catch (error) {
    console.error("Hikayeleri getirirken hata:", error);
    res.status(500).json({ message: "Hikayeler alınırken bir hata oluştu." });
  }
});

// Belirli bir hikayeyi getirme rotası
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

// Belirli bir hikayede belirli bir sahneyi getirme rotası
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

// Sunucu başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
