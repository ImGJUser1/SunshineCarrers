const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json'); // must exist!

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

(async () => {
  await admin.auth().setCustomUserClaims('GY2v09K4NTSjsYRb3Rp9FmGJbBl1', { role: 'admin' });
  await admin.auth().setCustomUserClaims('LjcFaKJZHwPxmdobSw6ki7nyrjr2', { role: 'admin' });
  console.log('✅ Both users are now admins');
  process.exit(0);
})();