import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("Connected to mongoDB");
    } catch(err) {
        console.log(err);
    }
}

export default ConnectDb;