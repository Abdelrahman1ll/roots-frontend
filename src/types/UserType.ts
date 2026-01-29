export type UserType = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  birthday?: string | null;
  role: string;
  createdAt: string;
  PROFILE?: boolean;
};
