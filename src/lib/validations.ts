import { z } from "zod";

// Content validation schemas
export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters")
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      "HTML tags are not allowed"
    ),
});

export const postContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(5000, "Post must be less than 5000 characters")
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      "HTML tags are not allowed"
    ),
});

export const bioSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(1000, "Bio must be less than 1000 characters")
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      "HTML tags are not allowed"
    )
    .optional(),
});

export const songDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      "HTML tags are not allowed"
    )
    .optional(),
});

export const eventDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .max(3000, "Description must be less than 3000 characters")
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      "HTML tags are not allowed"
    )
    .optional(),
});
