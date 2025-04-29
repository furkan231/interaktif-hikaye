const mongoose = require("mongoose");

// Choice Şeması
const ChoiceSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Seçim metni gereklidir."],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Seçim resmi URL'si gereklidir."],
    trim: true,
    default: "https://via.placeholder.com/50?text=No+Image",
  },
  nextSceneId: {
    type: String,
    required: [true, "Sonraki sahne ID'si gereklidir."],
    trim: true,
  },
});

// Scene Şeması
const SceneSchema = new mongoose.Schema({
  sceneId: {
    type: String,
    required: [true, "Sahne ID'si gereklidir."],
    trim: true,
    // unique: true kaldırıldı
  },
  text: {
    type: String,
    required: [true, "Sahne metni gereklidir."],
    trim: true,
  },
  choices: {
    type: [ChoiceSchema],
    default: [],
    validate: [arrayLimit, "{PATH} en az bir seçim içermelidir."],
  },
});

// Sahneler dizisinin en az bir seçim içerdiğini doğrulayan fonksiyon
function arrayLimit(val) {
  return val.length > 0;
}

// Story Şeması
const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Hikaye başlığı gereklidir."],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Yazar bilgisi gereklidir."],
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300",
    trim: true,
  },
  scenes: {
    type: [SceneSchema],
    required: [true, "Hikaye sahneleri gereklidir."],
    validate: [arrayLimit, "{PATH} en az bir sahne içermelidir."],
  },
  startScene: {
    type: String,
    required: [true, "Başlangıç sahnesi ID'si gereklidir."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Modeli oluştur ve dışa aktar
const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
