import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello! Your token is valid.",
    user: req.user
  });
});

export default router;
