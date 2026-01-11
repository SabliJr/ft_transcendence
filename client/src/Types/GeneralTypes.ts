export interface ApiError {
  response?: {
    status: number;
    data: {
      error?: string;
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
}

export interface iErrorMsgs {
  fieldsEmpty: string;
  termsNotChecked: string;
  validPwdErr: string;
  validEmailErr: string;
  emailExistsErr: string;
  theNameErr: string;
}