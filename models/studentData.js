import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true},
    password: String,
    phoneNo: Number,
    s_id: { type: Number, unique: true },
    selectedProject: { type: String, default: null },
    projectSelectedAt: { type: Date, default: null }
})

export default mongoose.model('student', studentSchema);