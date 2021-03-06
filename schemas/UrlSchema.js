import mongoose from 'mongoose';

const URLSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    short: {type: String, required: true, unique: true},
    url: {type: String, required: true},
    visits: {type: Number, required: true},
    date: {type: String, required: true},
    owner: {type: mongoose.Types.ObjectId},
    code: {type: String, required: true}
}, {collection: 'urls'});

export default mongoose.model('URL', URLSchema);