import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRouter.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import mongoSanitize from "express-mongo-sanitize";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50kb" }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api", limiter);
app.use("/api/v1/auth", userRouter);

app.use(globalErrorHandler);

export default app;
