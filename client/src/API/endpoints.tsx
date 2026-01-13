import axios from "axios";
import type { loginInfo, iRegistrationInfo } from "../Types/UserStuffTypes";

// const SERVER_URL =
//   import.meta.env?.NODE_ENV === "production"
//     ? "https://yieldbook.com"
//     : "http://localhost:8000";

const AUTH_SERVER = "http://localhost:8000";

// ------------------------ Auth -------------------------
const onAuthWithGoogle = async (token: string) => {
  return await axios.get(`${AUTH_SERVER}/auth/google/callback`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token },
    withCredentials: true,
  });
};

const onRefreshToken = async () => {
  return await axios.get(`${AUTH_SERVER}/refresh-token`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onLogout = async () => {
  return await axios.get(`${AUTH_SERVER}/logout`, {
    withCredentials: true,
  });
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${AUTH_SERVER}/login`, JSON.stringify(loginData), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onVerifyEmail = async (token: string) => {
  return await axios.post(
    `${AUTH_SERVER}/verify-email`,
    JSON.stringify({ token }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onRequestVerificationAgain = async (email: string) => {
  return await axios.post(
    `${AUTH_SERVER}/request-verification-again`,
    JSON.stringify({ email }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onRegistration = async (registrationData: iRegistrationInfo) => {
  return await axios.post(
    `${AUTH_SERVER}/register`,
    JSON.stringify(registrationData),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// ---------------------- Market ---------------------------

const onGetCoins = async () => {
  console.log(`The request endpoint: ${AUTH_SERVER}/market/coins`);
  return await axios.get(`${AUTH_SERVER}/market/coins`, {
    withCredentials: true,
  });
};

export {
  onAuthWithGoogle,
  onRefreshToken,
  onLogout,
  onRegistration,
  onRequestVerificationAgain,
  onVerifyEmail,
  onLogin,
  onGetCoins,
};
