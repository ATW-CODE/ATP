export default function authenticateKiosk(req, res, next) {
  const secret = req.get("X-Kiosk-Secret");

  if (!secret || secret !== process.env.KIOSK_SECRET) {
    return res.status(401).json({ message: "Invalid kiosk secret" });
  }

  next();
}
