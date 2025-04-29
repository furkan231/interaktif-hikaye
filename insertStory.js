const mongoose = require("mongoose");
const Story = require("./models/Story");

// MongoDB bağlantı URL'si
const mongoURI = "mongodb://127.0.0.1:27017/my_database_name"; // Kendi veritabanı URL'inizi kullanın

// Kullanıcı ID'si (Geçerli bir kullanıcı ObjectId'si)
const userId = "60d5f484f8d2e814c89a0b1c"; // Örneğin

// Hikaye verisi
const storyData = {
  title: "Gece Yarısı Galerisindeki Karanlık",
  author: userId, // Kullanıcının ObjectId'si
  startScene: "start",
  imageUrl: "https://via.placeholder.com/300?text=Galeri",
  scenes: [
    {
      sceneId: "start",
      text: "Eski bir binanın zemin katında bulunan karanlık ofisinizde sabah kahvenizi yudumlarken bir telefon çalar. Şehir merkezindeki bir sanat galerisinde, paha biçilmez bir tablo çalındığı ve olay yerinde bir cinayet işlendiği bildiriliyor. Olay yerine varıyorsunuz. Galerinin içinde, karmaşık bir sahne sizi karşılıyor. Kurban, sanat galerisinin müdürü. Çalınan tablo ise uluslararası bir üne sahip, oldukça değerli bir eser.\nOlay yerinde iki dikkat çekici durum var:\n1. Güvenlik kamerası görüntüleri sistematik bir şekilde silinmiş gibi görünüyor.\n2. Galeriye yakın bir kafede oturan bir tanık, şüpheli birini gördüğünü iddia ediyor.",
      choices: [
        {
          text: "Güvenlik kamerası sisteminin teknik raporunu incelemek için uzman çağır.",
          nextSceneId: "A",
          imageUrl: "https://via.placeholder.com/50?text=A",
        },
        {
          text: "Tanıkla konuşup şüpheli hakkında bilgi al.",
          nextSceneId: "B",
          imageUrl: "https://via.placeholder.com/50?text=B",
        },
      ],
    },
    {
      sceneId: "A",
      text: "Bir güvenlik uzmanı çağırıyorsunuz. Uzman, kameraların sabah saat 4:00 civarında bilinçli olarak kapatıldığını tespit ediyor. Ayrıca, yedek sistemin yalnızca birkaç saniyelik bir görüntü kaydettiğini fark ediyorsunuz. Görüntülerde, bir figür galerinin arka kapısından hızla çıkarken belirsiz bir çanta taşıyor. Çantanın içinde tablo olabileceğini düşünüyorsunuz.\nBu ipucu sizi iki seçeneğe götürüyor:",
      choices: [
        {
          text: "Arka kapıyı incelemek için dışarı çık.",
          nextSceneId: "A1",
          imageUrl: "https://via.placeholder.com/50?text=A1",
        },
        {
          text: "Figürün kimliğini çözmek için galeride çalışanların listesini kontrol et.",
          nextSceneId: "A2",
          imageUrl: "https://via.placeholder.com/50?text=A2",
        },
      ],
    },
    {
      sceneId: "B",
      text: "Kafedeki tanık, sabaha karşı birinin galeriden çıkıp hızla uzaklaştığını gördüğünü söylüyor. Şüpheli, siyah bir ceket giymiş ve elinde büyük bir çanta taşımış. Tanık, şüphelinin galerinin hemen yakınındaki bir sokakta duran eski model bir arabaya bindiğini ve hızla uzaklaştığını belirtiyor.\nBu bilgi sizi iki seçeneğe götürüyor:",
      choices: [
        {
          text: "Tanığın tarif ettiği arabayı bulmak için çevredeki güvenlik kameralarını araştır.",
          nextSceneId: "B1",
          imageUrl: "https://via.placeholder.com/50?text=B1",
        },
        {
          text: "Arabayı tarif ederek şehirdeki plaka tanıma sisteminden bilgi iste.",
          nextSceneId: "B2",
          imageUrl: "https://via.placeholder.com/50?text=B2",
        },
      ],
    },
    {
      sceneId: "END",
      text: "Hikaye burada sona eriyor.",
      choices: [
        {
          text: "Hikayeyi tekrar başlat",
          nextSceneId: "start",
          imageUrl: "https://via.placeholder.com/50?text=Restart",
        },
      ],
    },
  ],
};

// Hikaye verisine kullanıcı ID'sini ekleyin
storyData.author = new mongoose.Types.ObjectId(userId);

// MongoDB bağlantısını kurma
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB bağlantısı başarılı!");

    // Yeni hikaye oluştur
    const newStory = new Story(storyData);

    // Hikayeyi kaydet
    try {
      const savedStory = await newStory.save();
      console.log("Hikaye başarıyla eklendi:", savedStory);
    } catch (saveError) {
      console.error("Hikaye ekleme hatası:", saveError);
    }

    // Bağlantıyı kapat
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });
