import{z} from 'zod';

export const createProblemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    tags: z.array(z.string()).optional(),
    acceptanceRate: z.number().min(0).max(100),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    }))
});

export const updateProblemSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    tags: z.array(z.string()).optional(),
    acceptanceRate: z.number().min(0).max(100).optional(),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional()
});

export const findByDifficultySchema = z.object({
    difficulty: z.enum(["Easy", "Medium", "Hard"])
});

export type CreateProblemDTO = z.infer<typeof createProblemSchema>;
export type UpdateProblemDTO = z.infer<typeof updateProblemSchema>;