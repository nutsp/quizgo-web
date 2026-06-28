import { z } from "zod";

export const COVER_IMAGE_URL_ERROR = "URL รูปภาพปกไม่ถูกต้อง";

export const coverImageUrlSchema = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value || value.trim() === "") return true;
      if (value.length > 2048) return false;
      try {
        const parsed = new URL(value.trim());
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: COVER_IMAGE_URL_ERROR }
  );

export function isValidCoverImageUrl(value?: string | null): boolean {
  if (!value || value.trim() === "") return false;
  return coverImageUrlSchema.safeParse(value).success;
}
