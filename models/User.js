import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAdmin: {type: String, default: false},
}, {
  timestamps: true,
});

const User = mongoose.models.User ? mongoose.models.User: mongoose.model('User', UserSchema); 
export default User;
