import mongoose from 'mongoose';

const PasswordSchema = new mongoose.Schema({
    password: {type: String, required: true, unique: true},
    uid: {type: String, required: true, unique: true}
}, {collection: 'passwords'});

export default mongoose.model('Password', PasswordSchema);