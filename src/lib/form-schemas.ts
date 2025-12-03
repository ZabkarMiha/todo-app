import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(30, {
      message: "Title must not exceed 30 characters.",
    }),
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 3 characters.",
    })
    .max(300, {
      message: "Description must not exceed 300 characters.",
    })
    .optional(),
  completed: z.boolean(),
});

export const insertTaskSchema = taskFormSchema.extend({
  userId: z.string(),
});

export const userFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 3 characters.",
    })
    .max(30, {
      message: "Username must not exceed 30 characters.",
    }),
});

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(100, { message: "Password must not exceed 100 characters." })
  .superRefine((val, ctx) => {
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one uppercase letter.",
      });
    }
    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one lowercase letter.",
      });
    }
    if (!/[0-9]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one number.",
      });
    }
    if (!/[#?!@$%^&*-]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one special character.",
      });
    }
  });

export const registerFormSchema = userFormSchema.extend({
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});
