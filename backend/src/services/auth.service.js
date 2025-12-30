
const LEARNING_MODE = process.env.LEARNING_MODE === "true";
console.log("LEARNING_MODE =", process.env.LEARNING_MODE);
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleAuth = async (idToken) => {
  // // 1️⃣ Verify Google ID token
  // const ticket = await client.verifyIdToken({
  //   idToken,
  //   audience: process.env.GOOGLE_CLIENT_ID,
  // });

  // const payload = ticket.getPayload();

  // // 🔍 LEARNING LOG — Google Token Payload
  // console.log("\n===== GOOGLE TOKEN PAYLOAD =====");
  // console.log(payload);
  // console.log("================================\n");

  // const { sub: googleId, email, name } = payload;

  let payload;

if (LEARNING_MODE) {
  // 🧪 FAKE GOOGLE PAYLOAD (LEARNING ONLY)
  payload = {
    sub: "google_fake_123456",
    email: "testuser@gmail.com",
    name: "Test User",
  };

  console.log("\n===== FAKE GOOGLE PAYLOAD (LEARNING MODE) =====");
  console.log(payload);
  console.log("==============================================\n");
} else {
  // ✅ REAL GOOGLE VERIFICATION (PRODUCTION)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  payload = ticket.getPayload();
}

const { sub: googleId, email, name } = payload;


  // 2️⃣ Check if user exists
  const userQuery = `
    SELECT id, name, email
    FROM users
    WHERE google_id = $1
  `;

  const userResult = await pool.query(userQuery, [googleId]);

  let user;

  // 3️⃣ Create user if not exists
  if (userResult.rows.length === 0) {
    const insertUserQuery = `
      INSERT INTO users (name, email, google_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;

    const newUser = await pool.query(insertUserQuery, [
      name,
      email,
      googleId,
    ]);

    user = newUser.rows[0];

    await pool.query(
      `INSERT INTO wallets (user_id, balance) VALUES ($1, 0)`,
      [user.id]
    );
  } else {
    user = userResult.rows[0];
  }

  // 4️⃣ Issue ATP JWT
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // 🔍 LEARNING LOG — ATP JWT
  console.log("\n===== ATP JWT (RAW) =====");
  console.log(token);

  const decodedJwt = jwt.decode(token);
  console.log("\n===== ATP JWT PAYLOAD =====");
  console.log(decodedJwt);
  console.log("===========================\n");

  return {
    token,
    user,
  };
};
