import { CreateProblemDTO, UpdateProblemDTO } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { ProblemRepository } from "../repository/problem.repository";
import { NotFoundError, BadRequestError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService {
    createProblem(problemData: CreateProblemDTO): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
    updateProblem(id: string, problemData: UpdateProblemDTO): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
    private problemRepository: ProblemRepository;

    constructor(problemRepository: ProblemRepository) {
        this.problemRepository = problemRepository;
    }

    async createProblem(problemData: CreateProblemDTO): Promise<IProblem> {
        try {
            // santization of markdown
            const payload={
                ...problemData,
                description: await sanitizeMarkdown(problemData.description)
            }
            const problem = await this.problemRepository.createProblem(payload);
            return problem;
        } catch (error) {
            throw new BadRequestError("Failed to create problem");
        }
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        try {
            const problem = await this.problemRepository.getProblemById(id);
            return problem;
        } catch (error) {
            throw new NotFoundError("Problem not found");
        }
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
        try {
            const result = await this.problemRepository.getAllProblems();
            return result;
        } catch (error) {
            throw new Error("Failed to get all problems");
        }
    }

    async updateProblem(id: string, problemData: UpdateProblemDTO): Promise<IProblem | null> {
        try {
            const problem = await this.problemRepository.getProblemById(id);
            if (!problem) {
                throw new NotFoundError("Problem not found");
            }
            // sanitization of markdown
            const payload={
                ...problemData,
            }
            if (problemData.description) {
                payload.description = await sanitizeMarkdown(problemData.description);
            }
            const updatedProblem = await this.problemRepository.updateProblem(id, payload);
            return updatedProblem;

        } catch (error) {
            throw new Error("Failed to update problem");
        }
    }

    async deleteProblem(id: string): Promise<boolean> {
        try {
            const problem = await this.problemRepository.getProblemById(id);
            if (!problem) {
                throw new NotFoundError("Problem not found");
            }
            const result = await this.problemRepository.deleteProblem(id);
            return result;
        } catch (error) {
            throw new Error("Failed to delete problem");
        }
    }

    async findProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]> {
        try {
            const problems = await this.problemRepository.findProblemsByDifficulty(difficulty);
            return problems;
        } catch (error) {
            throw new Error("Failed to find problems by difficulty");
        }
    }
    async searchProblems(query: string): Promise<IProblem[]> {
        try {
            if (!query || query.trim() === "") {
                throw new BadRequestError("Query is required");
            }
            const problems = await this.problemRepository.searchProblems(query);
            return problems;
        } catch (error) {
            throw new Error("Failed to search problems");
        }
    }
}