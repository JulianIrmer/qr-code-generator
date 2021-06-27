import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email:      {type: String, required: true, unique: true},
    urls:       {type: Array, required: true, unique: false}
}, {collection: 'users'});

export default mongoose.model('User', UserSchema);