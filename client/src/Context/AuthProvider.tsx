import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  // useEffect,
} from "react";
import type { iRegistrationInfo } from "../Types/UserStuffTypes";
// import type { ApiError } from "../Types/GeneralTypes";

// import { onRefreshToken } from "../API/endpoints";

type AuthContextType = {
  state: iState;
  dispatch: React.Dispatch<iAction>;
  verificationEmail: string;
  setVerificationEmail: React.Dispatch<React.SetStateAction<string>>;
  registerValues: iRegistrationInfo;
  setRegisterValues: React.Dispatch<React.SetStateAction<iRegistrationInfo>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type iState = {
  accessToken: string | null;
  user_id?: string | null;
};

type iAction = {
  type: string;
  payload?: iState | undefined;
};

const initialState = {
  accessToken: null,
  user_id: null,
};

const authReducer = (state: iState, action: iAction): iState => {
  switch (action.type) {
    case "LOGIN":
      return {
        accessToken: action.payload?.accessToken as string,
        user_id: action.payload?.user_id,
      };
    case "LOGOUT":
      return {
        accessToken: null,
        user_id: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [registerValues, setRegisterValues] = useState<iRegistrationInfo>({
    user_name: "",
    email: "",
    password: "",
    customer_id: "",
  });

  // const path_name = window.location.pathname;
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await onRefreshToken();

  //       if (response.status === 200) {
  //         dispatch({
  //           type: "LOGIN",
  //           payload: {
  //             accessToken: response.data.accessToken,
  //             user_id: response.data.user.user_id,
  //           },
  //         });
  //       }
  //     } catch (error: unknown) {
  //       const apiError = error as ApiError;

  //       if (apiError?.response?.status !== 403) {
  //         console.log("It was 403 status err");
  //       } else {
  //         dispatch({ type: "LOGOUT" });
  //       }
  //     }
  //   })();
  // }, [path_name]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        verificationEmail,
        setVerificationEmail,
        registerValues,
        setRegisterValues,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// @refresh reset
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
