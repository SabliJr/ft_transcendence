import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, EMAIL_HOST } from "../constants";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { query } from "../config/dbConfig";
import { Request, Response } from "express";
import {
  createRefreshToken,
  createAccessToken,
} from "../utils/handleTokens";
import transporter from "../config/nodeMailerConfig";

const CLIENT_URL =
  process.env?.NODE_ENV === "production"
    ? "https://yieldbook.com"
    : "http://localhost:3000";

const generateVerificationToken = (user_id: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto
    .createHash("sha256")
    .update(uuid)
    .digest("hex")
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, user_id }, REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1h",
  }); // Set to 1 hour
  return token;
};

const isValidAuthToken = (authToken: string) => {
  try {
    jwt.verify(authToken, REFRESH_TOKEN_SECRET as string);
    return true;
  } catch (error) {
    return false;
  }
};

// const checkUserAccess = async (userId: string) => {
//   const result = await query("SELECT * FROM user_profile WHERE user_id=$1", [
//     userId,
//   ]);

//   if (result.rows.length > 0) {
//     const { has_access, expires_at, plan_type, subscription_state } =
//       result.rows[0];
//     const now = new Date();

//     if (
//       has_access &&
//       plan_type === "onetime" &&
//       subscription_state === "active"
//     ) {
//       return true;
//     }

//     if (has_access && expires_at > now && plan_type === "subscription") {
//       return true; // User has access
//     }
//   }

//   return false; // User does not have access
// };

const verifyUser = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken || !cookies.userId) {
    res.sendStatus(401);
    return null;
  }

  const accessToken = cookies.accessToken;
  try {
    const decoded = await jwt.verify(
      accessToken as string,
      REFRESH_TOKEN_SECRET as string
    );
    const { user_id: id } = decoded as { exp: number; user_id: string };

    let user = await query("SELECT * FROM user_profile WHERE user_id=$1", [id]);
    if (user.rows.length === 0) {
      res.status(403).json({
        success: false,
        message: "User not found",
      });
      return null;
    }

    return id;
  } catch (error) {
    res.sendStatus(403);
    return null;
  }
};

const sendVerificationEmail = (email: string, token: string) => {
  // Send a verification email
  const mailOptions = {
    from: `Yieldbook` + EMAIL_HOST,
    to: email,
    subject: "Email Verification",
    html: `
      <html>
        <head>
            <title>Verify Your Email</title>  
            <style type="text/css">
              {{!-- your css goes here --}}
            </style>
        </head>
        <body>

            <h2 style="font-family: Arial, sans-serif; color: #1D3557;">
              Thanks for creating a account.
            </h2>

            <p style="
              font-family: Arial, sans-serif;
              font-size: 1rem;">
              Verify your email address by clicking this button below so that you can get up and running quickly.
            </p>
          <div>
            <a  href="${CLIENT_URL}/verify-email/${token}" 
              style="
                background-color: #1D3557;
                color: #FBFFFE;
                border: none;
                border-radius: .6rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                text-align: center;
                padding: .8rem 1rem;
                margin: .5rem 0;
                letter-spacing: .6px;">
                Verify Email
            </a>
          </div>

          <div style="
           margin: 2rem 0;
          ">
            <hr/>
          </div>
        </body>
      </html>
    `,
  };
  return mailOptions;
};

// Email Verification
const onEmailVerification = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "The verification link is invalid.",
      });
    }

    // Verify the token with a custom clock timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    const decoded = await jwt.verify(
      token as string,
      REFRESH_TOKEN_SECRET as string,
      {
        clockTimestamp: currentTime,
      }
    );
    const { user_id: id, exp } = decoded as {
      exp: number;
      user_id: string;
    };

    // Check if the token has expired
    if (exp && exp < currentTime) {
      return res.status(401).json({
        success: false,
        message: "The verification link has expired. Please register again.",
      });
    }

    // update the verification status in the database
    await query("UPDATE user_profile SET is_verified = TRUE WHERE user_id=$1", [
      id,
    ]);

    const le_user = await query(
      "SELECT * FROM user_profile WHERE user_id = $1",
      [id]
    );
    const { user_id, email } = le_user.rows[0];

    let user_paid = await query(
      "SELECT * FROM user_subscription WHERE customer_email=$1",
      [email]
    );

    let c_id;
    if (user_paid?.rows.length > 0) {
      let { customer_id, expires_at } = user_paid.rows[0];

      c_id = customer_id;
      const now = new Date();

      if (expires_at > now) {
        await query(
          "UPDATE user_profile SET customer_id=$1, expires_at=$2, has_access=$3, subscription_state=$4 WHERE user_id=$5",
          [customer_id, expires_at, true, "Active", user_id]
        );
      }

      await query(
        "UPDATE user_subscription SET user_id=$1 WHERE customer_id=$2",
        [user_id, customer_id]
      );
    }

    const accessToken = await createAccessToken(user_id); // Create an access token that expires in 30  minutes
    const refreshToken = await createRefreshToken(user_id); // Create a refresh token that expires in 10 days
    // const hasUserPaid = await checkUserAccess(user_id); // Checks whether the user has paid or not

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
  } catch (error: any) {
    console.error("Error during email verification:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
      error: error.message, // or any relevant information from the error
    });
  }
};

// this is for requesting verification again
const onReverifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email)
      return res.status(404).json({
        success: false,
        message: "User don't exist, please register.",
      });

    // Check if the email exists in the database
    const userResult = await query(
      "SELECT * FROM user_profile WHERE email = $1",
      [email]
    );
    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User don't exist, please register.",
      });
    }

    const user_id = userResult.rows[0].user_id;
    const newVerificationToken = generateVerificationToken(user_id); // Generate a new verification token

    // Update the existing token in the database (if you store it there)
    await query(
      "UPDATE user_profile SET verification_token = $1 WHERE email = $2",
      [newVerificationToken, email]
    );

    // Send a new verification email
    const laMailOption = sendVerificationEmail(
      email as string,
      newVerificationToken
    );
    await transporter.sendMail(laMailOption);

    res.status(200).json({
      success: true,
      message:
        "A new verification email has been sent, please check your email.",
    });
  } catch (error: any) {
    console.error("Error during requesting verification again:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
      error: error.message,
    });
  }
};

export {
  generateVerificationToken,
  sendVerificationEmail,
  isValidAuthToken,
  verifyUser,
  onReverifyEmail,
  onEmailVerification,
};
