import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
    name: { type: String, required: true },
    document: { type: Buffer, required: true }, // Base64 encoded document
    link: { type: String },
    // link: { type: String, required: true },
  });
  
  // Define the main submission schema
const submissionSchema = new mongoose.Schema({
    s_id: { type: Number, required: true }, // Student ID
    p_id: { type: String, required: true }, // Project ID
    week1: [weekSchema], // Array of objects for Week 1
    week2: [weekSchema], // Array of objects for Week 2
    week3: [weekSchema], // Array of objects for Week 3
    week4: [weekSchema], // Array of objects for Week 4
    final: [weekSchema], // Array of objects for the final submission
    viva: [weekSchema]
});

export default mongoose.model('submission', submissionSchema);