import mongoose from "mongoose";

const connectDb = async() => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDb connected successfully : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to database : ${error.message}`);
        process.exit();
    }
}

export default connectDb;




