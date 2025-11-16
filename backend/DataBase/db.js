import mongoose from "mongoose";

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DataBase connect successfully");
    } catch (error) {
        console.log("DataBase did not connect",error)
    }
};

export default connectToDb;