import express from 'express';
const router = express.Router();
import multer from 'multer';
import documentModel from '../models/documentData.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('documentFile'), async (req, res) => {
    try {

        if(!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const { project_id, type } = req.body;

        const document = new documentModel({
            name: req.file.originalname,
            document: req.file.buffer,
            project_id: project_id,
            type: type
        });

        await document.save();
        res.status(200).send('File uploaded successfully');

    } catch (error) {
        console.log(error);
        res.status(500).send("Error uploading file");
    }
})

router.get('/:type/download/:id', async (req, res) => {
    try {
        const document = await documentModel.findOne({project_id: req.params.id, type: req.params.type});
        if(!document) return res.status(404).send('File not found');

        res.set({
            'Content-Type' : 'application/pdf',
            'Content-Disposition': `attachment; filename=${document.name}`,
        });

        res.send(document.document);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error downloading file');
    }
})

router.get('/:type/download', async (req, res) => {
    try {
        const document = await documentModel.findOne({ type: req.params.type});
        if(!document) return res.status(404).send('File not found');

        res.set({
            'Content-Type' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename=${document.name}`,
        });

        res.send(document.document);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error downloading file');
    }
})

export default router;

