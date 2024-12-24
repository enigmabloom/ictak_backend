import express from 'express';
const router = express.Router();
import multer from 'multer';
import submissionModel from '../models/submissionData.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post('/weekly', upload.single('submissionFile'),async (req, res) => {
//     try {
//         if(!req.file) {
//             return res.status(400).send('No file uploaded');
//         }

//         await submission.save();
//         res.status(200).send('File uploaded successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Error uploading file');
//     }
// })

router.post('/initial', async(req, res) => {
    try {
        const { s_id, p_id } = req.body;

        if(!s_id || !p_id) {
            return res.status(400).json({message: 'Student ID and Project ID are required.'})
        }

        const newSubmission = new submissionModel({
            s_id: s_id,
            p_id: p_id,
            week1: [],
            week2: [],
            week3: [],
            week4: [],
            final: [],
        });
        const savedSubmission = await newSubmission.save();
        res.status(201).json({ message: 'Submission created successfully', data: savedSubmission})
    } catch (error) {
        console.error(`Error saving submission`, error);
        res.status(500).json({ message: `Server error`, error: error.message});
    }
})

router.post('/weekly', upload.single('submissionFile'), async (req, res) => {
    try {
      const { s_id, p_id, week, link } = req.body;
      const file = req.file;
  
      if (!s_id || !p_id || !week || !link || !file) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Find the submission document for the student and project
      const submission = await submissionModel.findOne({ s_id, p_id });
  
      if (!submission) {
        return res.status(404).json({ message: 'Submission record not found.' });
      }

      const fileData = {
        name: file.originalname,
        document: file.buffer,
        link
      }

      switch(week) {
        case '1':
          submission.week1.push(fileData);
          break;
        case '2':
          submission.week2.push(fileData);
          break;
        case '3':
          submission.week3.push(fileData);
          break;
        case '4':
          submission.week4.push(fileData);
          break;
        default:
          return res.status(400).json({ error: 'Invalid week'});
      }
  
      // Save the updated submission document
      await submission.save();
  
      // Respond with a success message
      res.status(200).json({ message: 'Week submitted successfully', data: submission });
    } catch (error) {
      console.error('Error submitting the week:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

  router.get('/download-weekly', async (req, res) => {
    try {
      const { s_id, p_id, week } = req.body;
  
      if (!s_id || !p_id || !week) {
        return res.status(400).json({ message: 's_id, p_id, and week are required.' });
      }
  
      // Find the submission record based on student ID and project ID
      const submission = await submissionModel.findOne({ s_id, p_id });
  
      if (!submission) {
        return res.status(404).json({ message: 'Submission record not found.' });
      }
  
      // Dynamically get the correct week array based on the week parameter
      const weekField = `week${week}`;
      const weekData = submission[weekField];
  
      if (!weekData || weekData.length === 0) {
        return res.status(404).json({ message: `No submission found for Week ${week}.` });
      }
  
      // Assuming there's only one document per week, get the first entry in the week array
      const weekDocument = weekData[0]; // You can adjust this if you have multiple submissions per week
  
      if (!weekDocument) {
        return res.status(404).json({ message: 'No document found for this week.' });
      }

      const fileName = weekDocument.name;
      const fileExtension = fileName.split('.').pop();
  
      // Convert the base64 file back to binary
      const buffer = Buffer.from(weekDocument.document, 'base64');

      const mimeTypes = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        rtf: 'application/rtf',
        txt: 'text/plain',
        odt: 'application/vnd.oasis.opendocument.text',
        epub: 'application/epub+zip',
      };

      const contentType = mimeTypes[fileExtension.toLowerCase()] || 'application/octet-stream';
  
      // Set headers for file download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`); // Adjust filename as needed
  
      // Send the file as a response
      res.send(buffer);
    } catch (error) {
      console.error('Error downloading the file:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  router.post('/final', upload.single('submissionFile'), async (req, res) => {
    try {
      const { s_id, p_id, link } = req.body;
      const file = req.file;
  
      if (!s_id || !p_id || !link || !file) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Find the submission document for the student and project
      const submission = await submissionModel.findOne({ s_id, p_id });
  
      if (!submission) {
        return res.status(404).json({ message: 'Submission record not found.' });
      }

      const fileData = {
        name: file.originalname,
        document: file.buffer,
        link
      }

      submission.final.push(fileData);
  
      // Save the updated submission document
      await submission.save();
  
      // Respond with a success message
      res.status(200).json({ message: 'Week submitted successfully', data: submission });
    } catch (error) {
      console.error('Error submitting the final:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/check-final', async (req, res) => {
  try {
    const { s_id, p_id } = req.query;

    if( !s_id || !p_id ) {
      return res.status(400).json({ message: 'Student ID and Project ID are required.' })
    }

    const submission = await submissionModel.findOne({ s_id, p_id });

    if (!submission) {
      return res.status(404).json({ message: `Submission record not found`});
    }

    const isFinalSubmitted = submission.final && submission.final.length > 0;
    res.status(200).json({ isFinalSubmitted });
  } catch (error) {
    console.error(`Error checking final submission:`, error);
    res.status(500).json({ message: `Server error`, error: error.message });
  }
})

router.post('/viva-voce', upload.single('submissionFile'), async (req, res) => {
  try {
    const { s_id, p_id } = req.body;
    const file = req.file;

    if (!s_id || !p_id || !file) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const submission = await submissionModel.findOne({ s_id, p_id });

    if (!submission) {
      return res.status(404).json({ message: 'Submission record not found.' });
    }

    const fileData = {
      name: file.originalname,
      document: file.buffer,
    }

    submission.viva.push(fileData);

    await submission.save();

    res.status(200).json({ message: 'Viva-voce submitted successfully', data: submission });
  } catch (error) {
    console.error('Error submitting the viva-voce:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})

export default router;