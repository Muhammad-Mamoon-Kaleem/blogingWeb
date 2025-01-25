import mongoose from "mongoose";

const ConnectMongoose = async()=>{
    try {
       await mongoose.connect(`${process.env.MONGO_URL}`)
       console.log("Mongo Db Connected");
    } 
    catch (error) {
        console.log('Mongo db connection Failed',error);  
    }
}
export default ConnectMongoose;