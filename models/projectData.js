import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    p_id: String,
    p_name: String,
    p_desc: String,
    p_type: String,
    p_dur: String
})

export default mongoose.model('project', projectSchema);