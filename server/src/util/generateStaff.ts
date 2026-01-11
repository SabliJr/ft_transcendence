import { REFRESH_TOKEN_SECRET, ACCESS_SECRET_KEY } from "../constants";
// import { iUserInfo } from "../Types/AppTypes";
import jwt from "jsonwebtoken";
import { Response } from "express";

async function createRefreshToken(user_id: string) {
  const refreshToken = await jwt.sign(
    { user_id },
    REFRESH_TOKEN_SECRET as string,
    { expiresIn: "10d" }
  );

  return refreshToken;
}

async function createAccessToken(user_id: string): Promise<string> {
  const accessToken = await jwt.sign({ user_id }, ACCESS_SECRET_KEY as string, {
    expiresIn: "30m",
  });

  return accessToken;
}

// The response handler function that returns stuff whether a user has logged in or not
async function handleUserLoginResponse(
  res: Response,
  user: { user_id: string; customer_id: string; hasUserPaid: boolean },
  accessToken: string,
  refreshToken: string
) {
  const { user_id, customer_id, hasUserPaid } = user;

  if (!hasUserPaid) {
    // Send response without setting cookie
    return res.status(202).json({
      success: true,
      message: "The login was successful!",
      user: {
        user_id,
        customer_id,
        hasUserPaid,
      },
      accessToken,
    });
  } else {
    // Send response with cookie
    return res
      .status(202)
      .cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        secure: true,
        // domain: '.sponsorwave.com',
      })
      .json({
        success: true,
        message: "The login was successful!",
        user: {
          user_id,
          customer_id,
          hasUserPaid,
        },
        accessToken,
      });
  }
}

export { createRefreshToken, createAccessToken, handleUserLoginResponse };
