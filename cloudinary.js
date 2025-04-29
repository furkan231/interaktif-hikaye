// cloudinary.js
const cloudinary = require("cloudinary").v2;

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: "dpmjuloo8", // Dashboard'dan alınan Cloud Name
  api_key: "996572389773644", // Dashboard'dan alınan API Key
  api_secret: "KcdSc7uIJgyJMqqzg-rOfjkZf3g", // Dashboard'dan alınan API Secret
});

module.exports = cloudinary;
