import React, { useState } from "react";
import "./AuthPages.css";

import LogoIcon from "../../Assets/Icon.png";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useGoogleLogin } from "@react-oauth/google";
// import Loader from "../../utils/Loader";

import type { iErrorMsgs } from "../../Types/GeneralTypes";
import { useAuth } from "../../Context/AuthProvider";
import { onAuthWithGoogle, onRegistration } from "../../API/endpoints";
// import { ContextGlobalVars } from "../../Context/ContextGlobalVars";
// import { iGlobalValues } from "../../Types/ContextGlobalVars";
// import EmailUsageNotify from "../GeneralUse/emailUsageNotify";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_NAME_REGEX = /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#-&_$%()<>^*~]).{8,20}$/;

// Instead of catch (error: any)
// Define an error interface
interface ApiError {
  response?: {
    status: number;
    data: {
      error?: string;
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
}

interface GoogleLoginResponse {
  code: string;
  // Add other properties that might be in the response
}

const SignUp: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isFocused, setIsFocused] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [gLoginLoading, setGLoginLoading] = useState(false);

  const [errMsg, setErrMsg] = useState<iErrorMsgs>({
    fieldsEmpty: "",
    termsNotChecked: "",
    validPwdErr: "",
    validEmailErr: "",
    emailExistsErr: "",
    theNameErr: "",
  });

  const navigate = useNavigate();
  const { registerValues, setRegisterValues, setVerificationEmail, dispatch } =
    useAuth();
  // const contextValues = useContext<Partial<iGlobalValues>>(ContextGlobalVars);
  // const { closeNotice, setCloseNotice } = contextValues as iGlobalValues;

  const intGoogleSignUp = useGoogleLogin({
    onSuccess: (tokenResponse: GoogleLoginResponse) =>
      handleCredentialResponse(tokenResponse),
    ux_mode: "popup",
    select_account: false,
    scope: "profile email openid",
    flow: "auth-code",
  });

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setRegisterValues({
      ...registerValues,
      [field]: e.target.value || "",
    });
  };

  const handleCredentialResponse = async (response: { code: string }) => {
    setGLoginLoading(true);

    try {
      const gVerifyCode = response.code; // Access the ID token directly from the response object
      const res = await onAuthWithGoogle(gVerifyCode);

      console.log("res: ", res);
      if (res?.status === 201) {
        const { accessToken } = res.data;
        const { user_id } = res.data.user;

        if (user_id) {
          console.log("user_id: ", user_id);
          dispatch({
            type: "LOGIN",
            payload: {
              accessToken,
              user_id,
            },
          });

          navigate(`/dashboard/${user_id}`, { replace: true });
        }
      }
    } catch (error: unknown) {
      // Type guard to check if error matches your ApiError interface
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as ApiError;
        // Now use apiError.response safely
        if (apiError.response) {
          // Your error handling code
        }
      }
    } finally {
      setGLoginLoading(false);
    }
  };

  // to check if the email is valid
  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !registerValues.email ||
      !registerValues.password ||
      !registerValues.user_name
    ) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        fieldsEmpty: "Please fill in all fields.",
      }));
      return;
    }

    if (!agreeTerms) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        termsNotChecked: "Please agree to the terms of service to proceed!.",
      }));
      return;
    }

    if (!validateEmail(registerValues.email)) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        validEmailErr: "Please enter a valid email address.",
      }));
      return;
    }

    if (!PWD_REGEX.test(registerValues.password)) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        validPwdErr:
          "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.",
      }));
      return;
    }

    if (!USER_NAME_REGEX.test(registerValues.user_name)) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        theNameErr:
          "Username must be 3-15 characters long and can contain only letters, numbers, underscores and hyphens.",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await onRegistration(registerValues);
      setRegisterValues({
        user_name: "",
        email: "",
        password: "",
        customer_id: "",
      });
      if (res.status === 201) {
        navigate("/verify", { replace: true });
      }
      setVerificationEmail(registerValues.email);
    } catch (err: unknown) {
      // Type guard to check if error matches your ApiError interface
      if (err && typeof err === "object" && "response" in err) {
        const apiError = err as ApiError;
        if (apiError.response?.status === 409) {
          setErrMsg((prevValue) => ({
            ...prevValue,
            emailExistsErr:
              apiError.response?.data.errors?.[0]?.msg ||
              "Email already exists",
          }));
        } else if (apiError.response?.status === 500) {
          setErrMsg((prevValue) => ({
            ...prevValue,
            fieldsEmpty:
              apiError.response?.data?.error ||
              apiError.response?.data?.errors?.[0]?.msg ||
              "Server error",
          }));
        } else {
          // Handle other errors
          setErrMsg((prevValue) => ({
            ...prevValue,
            fieldsEmpty: "Something went wrong. Please try again later.",
          }));
        }
      } else {
        // Handle non-API errors
        setErrMsg((prevValue) => ({
          ...prevValue,
          fieldsEmpty: "Something went wrong. Please try again later.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (gLoginLoading || isLoading) {
    console.log("It's happening!");
    // return <Loader />;
  }

  return (
    <div className='login-container'>
      <div className='login-form-section'>
        <div className='login-form-wrapper'>
          <h1 className='sign-in-title'>Sign Up</h1>
          <p className='sign-in-subtitle'>Enter your basic info to Sign Up!</p>

          <button
            className='google-sign-in-btn'
            onClick={() => intGoogleSignUp()}>
            <img
              src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
              alt='Google logo'
              className='google-icon'
            />
            Sign Up with Google
          </button>

          {/* seperator */}
          <div className='separator'>
            <span className='separator-text'>Or</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                placeholder='Enter your name'
                value={registerValues.user_name}
                onChange={(e) => {
                  onValueChange(e, "user_name");
                  setErrMsg((prevValue) => ({
                    ...prevValue,
                    fieldsEmpty: "",
                    theNameErr: "",
                  }));
                }}
              />
              {/* To check if the name is valid */}
              {errMsg.theNameErr ? (
                <p className='nameErrMsg'>{errMsg.theNameErr}</p>
              ) : null}
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email address'
                value={registerValues.email}
                onChange={(e) => {
                  onValueChange(e, "email");
                  setErrMsg((prevValue) => ({
                    ...prevValue,
                    validEmailErr: "",
                    emailExistsErr: "",
                    fieldsEmpty: "",
                  }));
                }}
              />
              {/* To check if the email is valid */}
              {errMsg.validEmailErr ? (
                <p className='emailErrMsg'>{errMsg.validEmailErr}</p>
              ) : null}

              {/* To check if the email already exists */}
              {errMsg.emailExistsErr ? (
                <p className='emailErrMsg'>{errMsg.emailExistsErr}</p>
              ) : null}
            </div>

            <div className='form-group' style={{ position: "relative" }}>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                placeholder='Enter your password'
                type={showPwd ? "text" : "password"}
                onChange={(e) => {
                  onValueChange(e, "password");
                  setErrMsg((prevValue) => ({
                    ...prevValue,
                    validPwdErr: "",
                    fieldsEmpty: "",
                  }));
                }}
                value={registerValues.password}
                autoComplete='off'
              />
              <span
                className='pwdEye'
                onClick={() => {
                  setShowPwd(!showPwd);
                }}>
                {showPwd ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {/* Check if the password is correct */}
            {errMsg.validPwdErr ? (
              <p id='pwdErrMsg'>{errMsg.validPwdErr}</p>
            ) : null}

            {/* To check if all fields are filled */}
            {errMsg.fieldsEmpty ? (
              <p className='emptyFieldsErrMsg'>{errMsg.fieldsEmpty}</p>
            ) : null}

            <div className='agree'>
              <input
                type='checkbox'
                id='agreeCheck'
                checked={agreeTerms}
                onChange={() => {
                  setAgreeTerms(!agreeTerms);
                  setErrMsg((prevValue) => ({
                    ...prevValue,
                    termsNotChecked: "",
                  }));
                }}
              />

              <label htmlFor='agreeCheck' className='agreeText'>
                I agree to the{" "}
                <span onClick={() => navigate("/terms-of-service")}>
                  Terms of Service
                </span>{" "}
                &{" "}
                <span onClick={() => navigate("/privacy-policy")}>
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {errMsg.termsNotChecked ? (
              <p className='termsErrMsg'>{errMsg.termsNotChecked}</p>
            ) : null}
            <button type='submit' className='sign-in-btn'>
              Sign Up
            </button>
          </form>

          <div className='login-footer'>
            {/* <a href='#' className='forgot-password'>
              Forgot your password?
            </a> */}
            <p className='signup-link'>
              Do you already have an account?{" "}
              <a href='#' onClick={() => navigate("/login")}>
                Login
              </a>
            </p>
          </div>
        </div>

        <div className='policies'>
          <a href='#' onClick={() => navigate("/faqs")}>
            FAQs
          </a>
          <a href='#' onClick={() => navigate("/privacy-policy")}>
            Privacy Policy
          </a>
          <a href='#' onClick={() => navigate("/terms-of-service")}>
            Terms & Conditions
          </a>
        </div>
      </div>

      <div className='hero-section'>
        <div className='hero-content'>
          <div className='logo-container' onClick={() => navigate("/")}>
            <img src={LogoIcon} alt='logo-icon' className='logo-icon' />
            <h2 className='_login_logo_text'>
              Yield<span>book</span>
            </h2>
          </div>

          <h2 className='hero-title'>
            Your <span>Crypto Journey</span> Starts Here.
          </h2>
          <p className='hero-description'>
            Join a community of investors tracking portfolios, exploring market
            data, and sharing insights. Yieldbook helps you understand your
            crypto holdings with clarity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
