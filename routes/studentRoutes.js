import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import jwt from 'jsonwebtoken';
import studentModel from '../models/studentData.js'
// import studentModelAmina from '../model/studentData.js'
import examModel from '../models/scoreData.js'; // Exam score model
import markModel from '../models/markData.js';

// Route to add exam scores
router.post('/score', async (req, res) => {
  const { email, mark } = req.body;
  try {
    // Check if the email already exists in the database
    const existingRecord = await examModel.findOne({ email });
    if (existingRecord) {
      return res.status(400).json({ message: "Email ID is already registered." });
    }

    // Create a new exam record
    const newExamRecord = new examModel({
      email,
      mark
    });

    // Save the record to the database
    await newExamRecord.save();

    res.status(201).json({ message: "Exam score added successfully!", data: newExamRecord });
  } catch (error) {
    console.error("Error adding exam score:", error);
    res.status(500).json({ message: "Error adding exam score." });
  }
});

// Register route for student
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if exam record exists for the student
    const examRecord = await examModel.findOne({ email: email });

    if (!examRecord) {
      return res.status(404).json({ message: "Exam record not found. Cannot register." });
    }

    // Check if the exam mark is greater than 50
    if (examRecord.mark < 50) {
      return res.status(400).json({ message: "Registration Failed: Your exam score does not meet the required minimum. Please try again after improving your score." });
    }

    // Check if student is already registered
    const existingStudent = await studentModel.findOne({ email: email });
    if (existingStudent) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const generateStudentID = async () => {
      let id;
      do {
        id = Math.floor(10000 + Math.random() * 90000);
      } while (await studentModel.findOne({ s_id: id }));
      return id;
    };

    const studentID = await generateStudentID();

    // Proceed with creating a new student record
    const newStudent = new studentModel({
      s_id: studentID,
      name,
      email,
      password: hashedPassword,
      phoneNo: phone,

    });

    await newStudent.save();
    res.status(201).json({ message: "Registration successful! You can now log in." });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Error registering student." });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await studentModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT (optional)
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });

    const userWithoutSensitiveInfo = user.toObject();
    delete  userWithoutSensitiveInfo.password, userWithoutSensitiveInfo.phoneNo, userWithoutSensitiveInfo._id;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutSensitiveInfo,
      token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

router.put('/selectProject', async (req, res) => {
    const { s_id, p_id } = req.body;
    try {
        const data = await studentModel.findOneAndUpdate(
            { s_id },
            { selectedProject: p_id,
              projectSelectedAt: new Date()
            },
            { new: true }
        );
        res.status(200).json({ message: 'Project selected successfully', data});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/marks', async(req, res) => {
  const { s_id, p_id } = req.query;
  try {
    const data = await markModel.findOne({ s_id, p_id });
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
})

export default router;
