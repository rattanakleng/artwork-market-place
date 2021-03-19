const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose
            .connect(db, {
                //this statement is required by specific version of mongoose
                userNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            })

        console.log("MongoDB Connected")
    } catch (err) {
        console.error(err.message);
        //exit(1) exit the connection with fails status
        process.exit(1);
    }
}

module.exports = connectDB;

/*
// with .then syntac
const connectDB = () => {
    mongoose
        .connect(db, {
            //this statement is required by specific version of mongoose
            userNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => {
            console.error(err.message);
            //exit(1) exit the connection with fails status
            process.exit(1);
        });
};

module.exports = connectDB;
*/