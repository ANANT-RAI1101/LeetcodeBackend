import { IProblem,Problem } from "../models/problem.model";

export interface IProblemRepository {
    createProblem(problemData: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id:string): Promise<IProblem | null>;
    getAllProblems(): Promise<{ problems: IProblem[] ,total: number}>;
    updateProblem(id:string,problemData: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id:string): Promise<boolean>;
    findProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]>;
     searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {
    constructor(){

    }
    async createProblem(problemData:Partial<IProblem>): Promise<IProblem> {
        try {
            const problem = new Problem(problemData);
            await problem.save();
            return problem;
        } catch (error) {
            throw new Error("Failed to create problem");
        }
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        try {
            const problem = await Problem.findById(id);
            return problem;
        } catch (error) {
            throw new Error("Failed to get problem by ID");
        }
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
        try {
            const problems = await Problem.find().sort({ createdAt: -1 });
            const total = await Problem.countDocuments();
            return { problems, total };
        } catch (error) {
            throw new Error("Failed to get all problems");
        }
    }

    async updateProblem(id: string, problemData: Partial<IProblem>): Promise<IProblem | null> {
        try {
            const updatedProblem = await Problem.findByIdAndUpdate(id, problemData, { new: true });
            return updatedProblem;
        } catch (error) {
            throw new Error("Failed to update problem");
        }
    }

    async deleteProblem(id: string): Promise<boolean> {
        try {
            const result = await Problem.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new Error("Failed to delete problem");
        }
    }

    async findProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]> {
        try {
            const problems = await Problem.find({ difficulty: difficulty.toLowerCase() }).sort({ createdAt: -1 });
            return problems;
        } catch (error) {
            throw new Error("Failed to find problems by difficulty");
        }
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        try {
            const regex = new RegExp(query, 'i');
            const problems = await Problem.find({
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            }).sort({ createdAt: -1 });
            return problems;
        } catch (error) {
            throw new Error("Failed to search problems");
        }
    }
}