import mongoose from "mongoose";
import { serverConfig } from "./index";
import logger from "./logger.config";

export const connectDB=async()=>{
    try {
        await mongoose.connect(serverConfig.DB_URL);
        logger.info(`Connected to MongoDB successfully`);
        
        mongoose.connection.on("error",(error)=>{
            logger.error(`MongoDB connection error: ${error}`);
        });

        mongoose.connection.on("disconnected",()=>{
            logger.warn(`MongoDB connection lost.`);
        });

        process.on("SIGINT",async()=>{
            await mongoose.connection.close();
            logger.info(`MongoDB connection closed due to app termination.`);
            process.exit(0);
        });
    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error}`);
        process.exit(1); 
    }
}
