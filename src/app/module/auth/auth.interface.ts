export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPatientPayload {
  email: string;
  password: string;
}
