import { Request, Response } from "express"
import { GOOGLE_OAUTH_CLIENT_ID } from "../constants"
import { query } from "../config/dbConfig"
import { exchangeCodeForTokens, client } from "../config/gAuthConfig"
import { createAccessToken, createRefreshToken } from "../utils/handleTokens"

const onAuthWithGoogle = async (req: Request, res: Response) => {
  console.log("This point got hit");
  const { token } = req.query;
  // console.log("Token: ", token);

  try {
    const tokens = await exchangeCodeForTokens(token as string);

    // Verify the token ID
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token as string, // Use the ID token from the tokens
      audience: GOOGLE_OAUTH_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    console.log("The payload: ", payload);
    const user_id = payload?.sub as string;
    const email = payload?.email;
    const user_name = payload?.name;
    // const picture = payload?.picture;
    const email_verified = payload?.email_verified;

    // Check if the user exists in the database
    const userExists = await query(
      "SELECT * FROM user_profile WHERE email=$1",
      [email]
    );

    // Check if the customer has already paid
    // let userSubInfo = await query(
    //   "SELECT * FROM user_subscription WHERE customer_email=$1",
    //   [email]
    // );

    // if (userExists.rows.length > 0) {
    //   // If they do, log them in
    //   const { user_id } = userExists.rows[0];

    //   let c_id;
    //   if (userSubInfo?.rows.length > 0) {
    //     let { expires_at, customer_id } = userSubInfo.rows[0];

    //     const now = new Date();
    //     c_id = customer_id;

    //     if (expires_at > now) {
    //       await query(
    //         "UPDATE user_profile SET customer_id=$1, expires_at=$2, has_access=$3, subscription_state=$4 WHERE user_id=$5",
    //         [customer_id, expires_at, true, "Active", user_id]
    //       );

    //       await query(
    //         "UPDATE user_subscription SET user_id=$1 WHERE customer_id=$2",
    //         [user_id, customer_id]
    //       );
    //     }
    //   }

    //   const accessToken = await createAccessToken(user_id); // Create an access token that expires in 30  minutes
    //   const refreshToken = await createRefreshToken(user_id); // Create a refresh token that expires in 10 days
    //   const hasUserPaid = await checkUserAccess(user_id); // Checks whether the user has paid or not

    //   await handleUserLoginResponse(
    //     res,
    //     { user_id, customer_id: c_id, hasUserPaid },
    //     accessToken,
    //     refreshToken
    //   );
    // } else {
    // If they don't, store their info in the database and log them in
    console.log("db: ", query.name);
    await query(
      "INSERT INTO user_profile (user_id, user_name, email, is_verified, is_active) VALUES($1, $2, $3, $4, $5)",
      [user_id, user_name, email, email_verified, true]
    );

    // let c_id;
    // if (userSubInfo?.rows.length > 0) {
    //   let { expires_at, customer_id } = userSubInfo.rows[0];

    //   c_id = customer_id;
    //   const now = new Date();

    //   if (expires_at > now) {
    //     await query(
    //       "UPDATE user_profile SET customer_id=$1, expires_at=$2, has_access=$3, subscription_state=$4 WHERE user_id=$5",
    //       [customer_id, expires_at, true, "Active", user_id]
    //     );

    //     await query(
    //       "UPDATE user_subscription SET user_id=$1 WHERE customer_id=$2",
    //       [user_id, customer_id]
    //     );
    //   }
    // }

    const accessToken = await createAccessToken(user_id); // Create an access token that expires in 30  minutes
    const refreshToken = await createRefreshToken(user_id); // Create a refresh token that expires in 10 days
    // const hasUserPaid = await checkUserAccess(user_id); // Checks whether the user has paid or not

    // await handleUserLoginResponse(
    //   res,
    //   { user_id: user_id},
    //   accessToken,
    //   refreshToken
    // );
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        secure: true,
        // domain: '.sponsorwave.com',
      })
      .status(201)
      .json({
        user: {
          user_id: user_id,
        },
        accessToken,
        refreshToken,
      });
    // }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    // Handle the error
    res.status(500).json({
      error: "Something went wrong verifying with Google, please try again!",
    });
  }
};


export { onAuthWithGoogle };