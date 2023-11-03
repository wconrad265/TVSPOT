const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds (adjust as needed)
const plainPassword = '1234'; // The password you want to hash

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error while hashing password:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
