import express from "express";
import cors from "cors";

// Development dependencies
import morgan from "morgan";

const app = express();

app.use(morgan("tiny"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors);

app.get("/", (req, res) => {
  res.send({
    message: "Hello",
  });
});

export default app;
