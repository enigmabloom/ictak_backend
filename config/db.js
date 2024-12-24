import mongoose from 'mongoose';

const options = {
    dbName: 'internshipApp'
};

const connectDB = () => {
    mongoose.connect(process.env.mongodb_url, options)
        .then(() => console.log(`DB is connected`))
        .catch((error) => console.log(error));
}

export default connectDB;