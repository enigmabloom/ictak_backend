import mongoose from 'mongoose';

// const markSchema = new mongoose.Schema({
//     p_id: String,
//     s_id: Number,
//     week: String,
//     date: String,
//     marks: Number,
//     comment: String
// })

const markSchema = new mongoose.Schema({
    p_id: { type: String, required: true }, // Project ID
    s_id: { type: Number, required: true }, // Student ID
    
    // Marks for the 4 weeks (all can be null initially)
    week_1_marks: { type: Number, default: null },
    week_1_comment: { type: String, default: null },
    
    week_2_marks: { type: Number, default: null },
    week_2_comment: { type: String, default: null },
    
    week_3_marks: { type: Number, default: null },
    week_3_comment: { type: String, default: null },
    
    week_4_marks: { type: Number, default: null },
    week_4_comment: { type: String, default: null },
  
    // Final marks and viva voce (both can also be null initially)
    final_marks: { type: Number, default: null },
    final_comment: { type: String, default: null },
  
    viva_voce_marks: { type: Number, default: null },
    viva_voce_comment: { type: String, default: null }
});

export default mongoose.model('mark',markSchema);