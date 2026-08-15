import {z} from 'zod';
export const registerSchema=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(8)});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1)});
export const contentSchema=z.object({topic:z.string().min(2),type:z.enum(['image','carousel','reel','video']).default('image'),extra:z.string().optional()});
