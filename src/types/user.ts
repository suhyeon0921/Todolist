export interface JwtToken {
  accessToken: string;
  refreshToken?: string;
}

export interface JwtPayload {
  userId: number;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface UserPayload {
  userId: number;
  email?: string;
  phoneNumber?: string;
}
