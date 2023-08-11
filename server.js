import express from "express";
import "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import profileRoute from "./routes/profileRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/profile", profileRoute);

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
