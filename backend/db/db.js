import mongoose from "mongoose";

const Dbname = 'Ticketing';

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${Dbname}`);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`); 
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1);
    }
}

export default ConnectDB;