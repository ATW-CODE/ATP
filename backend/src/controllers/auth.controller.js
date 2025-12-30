import { handleGoogleAuth } from "../services/auth.service.js";

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const result = await handleGoogleAuth(idToken);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
