import express from "express";
import "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running with ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
