import axios from "axios";
import type { loginInfo, iRegistrationInfo } from "../Types/UserStuffTypes";
import type { iCoinInfo } from "../Types/MarketTypes"

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

const onGetCoins = async (currentPage: number) => {
  return await axios.get(`${AUTH_SERVER}/market/coins`, {
    withCredentials: true,
    params: { currentPage },
  });
};

const onGetCoin = async (coin_id: string) => {
  return await axios.get(`${AUTH_SERVER}/market/coin`, {
    withCredentials: true,
    params: { coin_id },
  });
};

const onGetCoinChartData = async (getCoinInfo: iCoinInfo) => {
  return await axios.get(`${AUTH_SERVER}/market/coin/chart_data`, {
    withCredentials: true,
    params: getCoinInfo,
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
  onGetCoin,
  onGetCoinChartData,
};
