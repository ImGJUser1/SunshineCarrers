const admin = require("firebase-admin");
admin.initializeApp();

const UID = "GY2v09K4NTSjsYRb3Rp9FmGJbBl1"; // your UID

admin.auth().setCustomUserClaims(UID, { role: "admin" })
  .then(() => {
    console.log("Admin role set successfully");
  })
  .catch(console.error);
