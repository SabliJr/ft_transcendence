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


export { createRefreshToken, createAccessToken };
