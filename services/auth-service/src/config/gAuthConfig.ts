import { OAuth2Client } from "google-auth-library";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "../constants/index";

const client = new OAuth2Client(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  "postmessage"
);

const exchangeCodeForTokens = async (code: string) => {
  const { tokens } = await client.getToken({
    code,
  });
  return tokens;
};

export { exchangeCodeForTokens, client };
