import { z } from "zod";

export const taskFormSchema = z
  .object({
    title: z
      .string()
      .min(2, {
        error: "Title must be at least 2 characters.",
      })
      .max(30, {
        error: "Title must not exceed 30 characters.",
      }),
    description: z
      .string()
      .min(2, {
        error: "Description must be at least 3 characters.",
      })
      .max(300, {
        error: "Description must not exceed 300 characters.",
      })
      .optional(),

    dueDate: z.date().optional().nullable(),

    completed: z.boolean(),
  });

export const insertTaskSchema = taskFormSchema.safeExtend({
  userId: z.string(),
});

export const userFormSchema = z.object({
  email: z.email({
    error: "Invalid email address.",
  }),
  username: z
    .string()
    .min(2, {
      error: "Username must be at least 3 characters.",
    })
    .max(30, {
      error: "Username must not exceed 30 characters.",
    }),
});

const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters." })
  .max(100, { error: "Password must not exceed 100 characters." })
  .superRefine((val, ctx) => {
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        error: "Password must contain at least one uppercase letter.",
      });
    }
    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        error: "Password must contain at least one lowercase letter.",
      });
    }
    if (!/[0-9]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        error: "Password must contain at least one number.",
      });
    }
    if (!/[#?!@$%^&*-]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        error: "Password must contain at least one special character.",
      });
    }
  });

export const registerFormSchema = userFormSchema
  .safeExtend({
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2, {
      error: "Name must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});
