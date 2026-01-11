import axios from "axios";
import type { loginInfo, iRegistrationInfo } from "../Types/UserStuffTypes";

const SERVER_URL =
  import.meta.env?.NODE_ENV === "production"
    ? "https://www.api.humanizewriter.com"
    : "http://localhost:8000";

console.log(SERVER_URL);

interface iHumanize {
  english_region: string;
  writing_tone: string;
  input_text: string;
}

// ------------------ Payment --------------------
const onSuccessCheckingOut = async (session_id: string) => {
  return await axios.get(`${SERVER_URL}/checkout_success`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { session_id },
    withCredentials: true,
  });
};

const onCheckingOut = async (price_id: string) => {
  return await axios.get(`${SERVER_URL}/check_out`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { price_id },
    withCredentials: true,
  });
};

const onCheckOutOneTime = async (price_id: string) => {
  return await axios.get(`${SERVER_URL}/check_out_onetime`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { price_id },
    withCredentials: true,
  });
};

// ------------------------ Auth -------------------------
const onAuthWithGoogle = async (token: string) => {
  return await axios.get(`${SERVER_URL}/auth/google/callback`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token },
    withCredentials: true,
  });
};

const onRefreshToken = async () => {
  return await axios.get(`${SERVER_URL}/refresh-token`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onLogout = async () => {
  return await axios.get(`${SERVER_URL}/logout`, {
    withCredentials: true,
  });
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${SERVER_URL}/login`, JSON.stringify(loginData), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onVerifyEmail = async (token: string) => {
  return await axios.post(
    `${SERVER_URL}/verify-email`,
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
    `${SERVER_URL}/request-verification-again`,
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
    `${SERVER_URL}/register`,
    JSON.stringify(registrationData),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// ------------------------ Write -------------------------

const onHumanize = async (to_humanize: iHumanize) => {
  return await axios.post(
    `${SERVER_URL}/services/humanize`,
    JSON.stringify({ to_humanize }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

export {
  onSuccessCheckingOut,
  onCheckingOut,
  onCheckOutOneTime,
  onAuthWithGoogle,
  onRefreshToken,
  onLogout,
  onRegistration,
  onRequestVerificationAgain,
  onVerifyEmail,
  onLogin,
  onHumanize,
};
