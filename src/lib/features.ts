export const FEATURE_FLAGS = {
  isAvatarUploadEnabled:
    process.env.NEXT_PUBLIC_ENABLE_AVATAR_UPLOAD === "true",
} as const;
