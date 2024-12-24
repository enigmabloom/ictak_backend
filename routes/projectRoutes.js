import express from 'express';
const router = express.Router();
import projectModel from '../models/projectData.js';

router.post('/add', async (req, res) => {
    const { p_id, p_name, p_desc, p_type, p_dur } = req.body;
    try {
        const newProject = new projectModel({ p_id, p_name, p_desc, p_type, p_dur });
        await newProject.save();
        res.status(200).json({message: 'Successfully added'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get('/all', async (req, res) => {
    try {
        const data = await projectModel.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const data = await projectModel.findOne({ p_id: req.params.id })
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
})

export default router;
