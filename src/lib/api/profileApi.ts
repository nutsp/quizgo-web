import { apiGet, apiPut } from "@/lib/api";
import type { UpdateProfileInput, UserProfile } from "@/lib/api/types";

export type UpdateProfileResponse = {
  id: string;
  email: string;
  display_name: string;
  public_display_name: string;
};

export const profileApi = {
  getProfile() {
    return apiGet<UserProfile>("/me/profile", true);
  },

  updateProfile(input: UpdateProfileInput) {
    return apiPut<UpdateProfileResponse>("/me/profile", input);
  },
};
