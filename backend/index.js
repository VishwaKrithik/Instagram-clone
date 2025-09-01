import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ConnectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import messageRoute from './routes/message.route.js'
import postRoute from './routes/post.route.js';
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT;

const __dirname = path.resolve();

// console.log(path.resolve(__dirname, "frontend", "dist", "index.html"))
// console.log(path.join(__dirname, "/frontend/dist"))

// app.get("/", (req, res) => {
//     return res.status(200).json({
//         message: "Im backend",
//         success: true
//     })
// })

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.URL],
    credentials:true
}
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get("/{*any}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT, () => {
    ConnectDb();
    console.log(`Listening on port ${PORT}`);
});