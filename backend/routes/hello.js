import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello! Your token is valid.",
    // express-jwt v7+ sets the token payload on `req.auth` by default.
    // Older versions used `req.user`. Return whichever is populated.
    user: req.auth || req.user
  });
});

export default router;
