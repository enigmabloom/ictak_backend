import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    email: String,
    mark: Number,
});

export default mongoose.model('score', examSchema);