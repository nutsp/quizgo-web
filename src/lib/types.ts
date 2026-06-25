export type AuthUser = {
  id: string;
  display_name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
};

export type RegisterInput = {
  display_name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
