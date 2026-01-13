import React, { useState } from "react";
import "./AuthPages.css";

import LogoIcon from "../../Assets/Icon.png";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
// import { onAuthWithGoogle, onLogin } from "../../API/endpoints";
import { useAuth } from "../../Context/AuthProvider";

import { FaEye, FaEyeSlash } from "react-icons/fa";

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

// Instead of (tokenResponse: any)
// Define a proper interface for the Google login response
interface GoogleLoginResponse {
  code: string;
  // Add other properties that might be in the response
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [gLoginLoading, setGLoginLoading] = useState(false);
  const [serverErrMsg, setServerErrMsg] = useState("");

  const [emptyFields, setEmptyFields] = useState("");
  const [isError, setIsError] = useState("");
  const [logInData, setLogInData] = useState({
    email: "",
    pwd: "",
  });

  const { setVerificationEmail } = useAuth(); // dispatch

  const intGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: GoogleLoginResponse) =>
      handleCredentialResponse(tokenResponse),
    ux_mode: "popup",
    select_account: false,
    scope: "profile email openid",
    flow: "auth-code",
  });

  const handleCredentialResponse = async (response: { code: string }) => {
    setGLoginLoading(true);

    try {
      const gVerifyCode = response.code; // Access the ID token directly from the response object
      // const res = await onAuthWithGoogle(gVerifyCode);
      console.log(gVerifyCode);

      // if (res?.status === 201 || res?.status === 202) {
      //   const { accessToken } = res.data;
      //   const { user_id } = res.data.user;

      //   if (user_id) {
      //     dispatch({
      //       type: "LOGIN",
      //       payload: {
      //         accessToken,
      //         user_id,
      //       },
      //     });

      //     navigate(`/dashboard/${user_id}`, { replace: true });
      //   }
      // }
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

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!logInData.email || !logInData.pwd) {
      setEmptyFields("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      // const response = await onLogin(logInData);

      // If a user email is verified and logged in is successful
      // if (response.status === 202) {
      //   // Save the user id and username in the context
      //   const { user_id } = response.data.user;
      //   setLogInData({ email: "", pwd: "" });

      //   if (user_id) {
      //     dispatch({
      //       type: "LOGIN",
      //       payload: {
      //         accessToken: response.data.token,
      //         user_id: user_id,
      //       },
      //     });

      //     navigate(`/dashboard/${user_id}`, { replace: true });
      //   } else {
      //     navigate("/chose-plan", { replace: true });
      //   }
      // }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response) {
        // Check if the error has a response and response data
        if (apiError.response.status === 403) {
          const theError = apiError.response.data.message;

          // If there are errors, update the state with the error message
          setServerErrMsg(theError || "");
          setVerificationEmail(logInData.email);
          navigate("/verify", { replace: true });
        } else if (
          apiError.response.data?.errors &&
          apiError.response.status === 500 &&
          apiError.response.data.errors.length > 0
        ) {
          setIsError(apiError.response.data.errors[0].msg);
        } else if (apiError.response.data?.errors) {
          setIsError(apiError.response.data.errors[0].msg);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (gLoginLoading || isLoading) {
    // return <Loader />;
  }

  return (
    <div className='login-container'>
      <div className='login-form-section'>
        <div className='login-form-wrapper'>
          <h1 className='sign-in-title'>Login</h1>
          <p className='sign-in-subtitle'>
            Enter your email and password to login!
          </p>

          <button
            className='google-sign-in-btn'
            onClick={() => intGoogleLogin()}>
            <img
              src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
              alt='Google logo'
              className='google-icon'
            />
            Login with Google
          </button>

          {/* seperator */}
          <div className='separator'>
            <span className='separator-text'>Or</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email address'
                value={logInData.email}
                onChange={(e) => {
                  setLogInData({ ...logInData, email: e.target.value });
                  setEmptyFields("");
                  setIsError("");
                }}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type={showPwd ? "text" : "password"}
                id='password'
                placeholder='Enter your password'
                value={logInData.pwd}
                onChange={(e) => {
                  setLogInData({ ...logInData, pwd: e.target.value });
                  setEmptyFields("");
                  setIsError("");
                }}
              />
              <span
                className='pwdEye'
                onClick={() => {
                  setShowPwd(!showPwd);
                }}>
                {showPwd ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button type='submit' className='sign-in-btn'>
              Login
            </button>
          </form>

          <div>
            {/* Password error */}
            {emptyFields && <p id='pwdErrMsg'>{emptyFields}</p>}
            {/* Server error */}
            {isError && <p className='serverErrMsg'>{isError}</p>}
            {serverErrMsg && <p className='serverErrMsg'>{serverErrMsg}</p>}
          </div>

          <div className='login-footer'>
            <a href='#' className='forgot-password'>
              Forgot your password?
            </a>
            <p className='signup-link'>
              Don't have an account?{" "}
              <a href='#' onClick={() => navigate("/signup")}>
                Sign Up
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
              Yield
              <span>book</span>
            </h2>
          </div>

          <h2 className='hero-title'>
            Welcome Back, <span>Investor</span>.
          </h2>
          <p className='hero-description'>
            Pick up where you left off. Track your portfolios, explore new
            assets, and connect with fellow investors on Yieldbook.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
