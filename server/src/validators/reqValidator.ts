import { REFRESH_TOKEN_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import { pool, query } from "../config/dbConfig";

interface iReqValid {
  id: string;
  customer_id: string;
}

const onValidateRequest = async (refreshToken: string): Promise<iReqValid> => {
  try {
    const decoded = await jwt.verify(
      refreshToken as string,
      REFRESH_TOKEN_SECRET as string
    );
    const { user_id } = decoded as {
      username: string;
      exp: number;
      user_id: string;
    };

    let user = await query("SELECT * FROM user_profile WHERE user_id=$1", [
      user_id,
    ]);
    if (user.rows.length === 0) {
      throw new Error("user not found, please login!");
    }

    let { user_id: id, customer_id } = user.rows[0];

    return { id, customer_id };
  } catch (error) {
    throw new Error("user not found, please login!");
  }
};

const checkUserAccess = async (userId: string) => {
  const result = await query("SELECT * FROM user_profile WHERE user_id=$1", [
    userId,
  ]);

  if (result.rows.length > 0) {
    const { has_access, expires_at, subscription_state } = result.rows[0];
    const now = new Date();

    if (has_access && expires_at > now && subscription_state === "Active") {
      return true; // User has access
    }
  }

  return false; // User does not have access
};

export { onValidateRequest, checkUserAccess };
