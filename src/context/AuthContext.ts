import { createContext } from "react";
import type { UserType } from "../types/UserType";

/**
 * AuthData defines the structure of the authentication response (user + tokens).
 */
export interface AuthData {
  user: UserType;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

/**
 * SetUserPayload can be a full AuthData object, a partial UserType object, or null (to logout).
 */
export type SetUserPayload = AuthData | UserType | null;

/**
 * AuthContextType defines the structure of the authentication state and its management functions.
 */
export type AuthContextType = {
  user: UserType | null;
  setUser: (data: SetUserPayload) => void;
  logout: () => void;
  initializing: boolean;
};

/**
 * AuthContext: Global authentication management.
 * Moved to a separate file to support Fast Refresh.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  initializing: true,
});
