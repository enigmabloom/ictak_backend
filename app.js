import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import './db/connection.js' //Amina DB connection
import connectDB from './config/db.js'
import studentRoutes from './routes/studentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js'
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/student', studentRoutes); //common for Amina
app.use('/project', projectRoutes);
app.use('/document', documentRoutes);
app.use('/submission', submissionRoutes);
app.use('/discussion', discussionRoutes);

app.get('/', (req, res) => {
    res.send('Working');
})

app.listen(process.env.port, () => {
    console.log(`Server is listening to port ${process.env.port}`);
})

connectDB();