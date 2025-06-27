import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Tour from './models/tourModel.js';
dotenv.config({ path: './config.env' });
mongoose.connect(process.env.CONNECTION_STR).then(() => console.log('DB connection successful!'));
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8'));
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}
if (process.argv[2] === '--import') {
    importData();
}
if (process.argv[2] === '--delete') {
    deleteData();
}