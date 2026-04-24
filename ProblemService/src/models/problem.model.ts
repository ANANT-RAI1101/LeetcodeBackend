import mongoose, { Document } from "mongoose";


export interface ITestCase {
    input: string,
    output: string
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    acceptanceRate: number;
    createdAt: Date;
    updatedAt: Date;
    testcases: ITestCase[];
}

const testCaseSchema=new mongoose.Schema<ITestCase>({
    input:{
        type: String,
        required: [true, "Test case input is required"],
        trim: true
    },
     output: {
        type: String,
        required: [true, "Output is required"],
        trim: true,
    }
})

const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title must be less than 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    difficulty: {
        type: String,
        required: [true, "Difficulty is required"],
        enum: {
            values: ["easy", "medium", "hard"],
            message: "Invalid difficulty level",
        },
    },
    tags:{
        type: [String],
        default: []
    },
    acceptanceRate: {
        type: Number,
        required: [true, "Acceptance rate is required"],
        min: [0, "Acceptance rate must be a positive number"],
        max: [100, "Acceptance rate must be a number between 0 and 100"]
    },
    testcases: [testCaseSchema]
},{
    timestamps: true
})

problemSchema.index({title:1},{unique:true});
problemSchema.index({difficulty:1});
export const Problem=mongoose.model<IProblem>("Problem",problemSchema)