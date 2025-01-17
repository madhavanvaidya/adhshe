const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {type: Number},
  gender: {type: String},
  profileImage: {type: String}
});

const User = mongoose.model('User', userSchema);



module.exports = User;
