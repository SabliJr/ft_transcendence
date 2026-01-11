import { query } from "../config/dbConfig";
import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { REFRESH_TOKEN_SECRET } from "../constants/index";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import transporter from "../config/nodeMailerConfig";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "../utils/verificationFunctions";
import { createRefreshToken, createAccessToken } from "../utils/handleTokens";

// User Registration
const onRegistration = async (req: Request, res: Response) => {
  const { user_name, email, password } = req.body;

  try {
    let user_id = uuidv4();
    const pwd = await hash(password, 12);
    const verificationToken = generateVerificationToken(user_id);

    let is_has_plan = await query(
      "SELECT * FROM user_subscription WHERE customer_email=$1",
      [email]
    );

    await query(
      "INSERT INTO user_profile (user_id, user_name, email, pwd, verification_token) VALUES($1, $2, $3, $4, $5)",
      [user_id, user_name, email, pwd, verificationToken]
    );

    // If the user has already paid attach it to their profile
    if (is_has_plan.rows.length > 0) {
      let { customer_id } = is_has_plan.rows[0];

      await query("UPDATE user_profile SET customer_id=$1 WHERE user_id=$2", [
        customer_id,
        user_id,
      ]);
    }

    // Send them a verification mail and wait
    const laMailOption = sendVerificationEmail(
      email as string,
      verificationToken
    );
    await transporter.sendMail(laMailOption);
    res.status(201).json({
      success: true,
      message:
        "The registration was successful. Please check your email for verification.",
    });
  } catch (error: any) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error.message, // or any relevant information from the error
    });
  }
};

// Login creator
const onLogin = async (req: Request, res: Response) => {
  const { user_id, user_name, email, is_verified, customer_id } = req.body;

  try {
    // Check if the creator is verified, if not, send a new verification email.
    if (!is_verified) {
      const newVerificationToken = generateVerificationToken(user_id);

      // Check if the token was generated successfully
      if (!newVerificationToken) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong, please try again.",
        });
      }

      const emailSent = sendVerificationEmail(
        email as string,
        newVerificationToken
      );

      // Check if the email was sent successfully
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong, please try again.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first, we have sent you a verification link.",
      });
    }

    const accessToken = await createAccessToken(user_id); // Create an access token that expires in 30  minutes
    const refreshToken = await createRefreshToken(user_id); // Create a refresh token that expires in 10 days

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
        user_id,
        accessToken,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong, please try again.");
  }
};

// Logout creator
const onLogout = async (req: Request, res: Response) => {
  try {
    // Get the token from the request
    // This will depend on how you're sending the token (e.g., in the Authorization header, in a cookie, etc.)
    const token = req.cookies.refreshToken;

    // Add the token to the blacklist
    // await addToBlacklist(token);
    // Clear the refreshToken cookie
    res
      .clearCookie("refreshToken", {
        secure: true,
        sameSite: "strict",
        httpOnly: true,
        // domain: '.sponsorwave.com',
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};

const onGetCredentials = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken && !cookies.userId) return res.sendStatus(401);

  const userId = cookies.userId;
  const accessToken = cookies.accessToken;

  try {
    const decoded = await jwt.verify(
      accessToken as string,
      REFRESH_TOKEN_SECRET as string
    );
    const { user_id: id } = decoded as {
      exp: number;
      user_id: string;
    };

    let user = await query("SELECT * FROM user_profile WHERE user_id=$1", [id]);
    if (user.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    // let user_has_payed = await checkUserAccess(userId);
    let { user_id, customer_id, has_access, is_canceled, plan_type } =
      user.rows[0];

    res.status(200).json({
      message: "Everything is fine, the user has payed!",
      user: {
        customer_id: customer_id,
        // user_has_payed: user_has_payed,
        user_id: user_id,
        has_access: has_access,
        is_canceled: is_canceled,
        plan_type: plan_type,
      },
    });
  } catch (error) {
    console.error("The was err getting user's credentials: ", error);
    console.error("This was the userId : ", userId);
    res.status(500).json({
      error:
        "Something went wrong getting user's credentials, please refresh the page!",
    });
  }
};

export { onRegistration, onLogout, onLogin, onGetCredentials };
