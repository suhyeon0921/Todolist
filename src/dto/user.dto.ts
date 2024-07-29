export interface SignupInput {
  email?: string;
  phoneNumber?: string;
  password: string;
  fullName: string;
  nickname: string;
}

export interface LoginInput {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}
