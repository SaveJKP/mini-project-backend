import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { routers } from "./api/routes/routers.js";
import { connectMongo } from "./config/mongo.js";
// import { connectTurso, db } from "./config/turso.js";
import limiter from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

// Global middlewares
app.use(helmet());
const corsOptions = {
  origin: ["http://localhost:5173", "https://mini-project-frontend-silk.vercel.app"], // your frontend domain
  credentials: true, // ✅ allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
// Centralized routes
app.use("/", routers());
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>โคตรเท่! Notes API จักรวาล</title>
      <style>
        body {
          font-family: 'Kanit', sans-serif; /* ฟอนต์สุดจ๊าบ */
          background: linear-gradient(135deg, #ff4d6d, #ff9f43); /* ไล่สีแบบมีพลัง */
          color: #fff; /* ตัวอักษรสีขาว เด่นสุดๆ */
          text-align: center;
          padding: 80px; /* เพิ่มพื้นที่หายใจ */
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh; /* เต็มจอไปเลย */
        }
        .container {
          background: rgba(0, 0, 0, 0.7); /* พื้นหลังทึบแสง ดูมีมิติ */
          border-radius: 15px; /* ขอบโค้งมน เก๋กู๊ด */
          padding: 60px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* เงาจัดเต็ม */
        }
        h1 {
          font-size: 3rem; /* หัวข้อใหญ่ ไฟลุก */
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* เงาตัวอักษร เพิ่มความเด่น */
          letter-spacing: 1.5px; /* ระยะห่างตัวอักษร เท่ห์ๆ */
        }
        p {
          font-size: 1.4rem; /* ข้อความกำลังดี */
          margin-top: 1.5rem;
          line-height: 1.8; /* ระยะห่างบรรทัดสบายตา */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4); /* เงาข้อความ */
        }
        strong {
          color: #fdd835; /* เน้นคำสำคัญด้วยสีเจ็บๆ */
        }
        code {
          background: #333; /* พื้นหลังโค้ดสีเข้ม */
          color: #eee; /* ตัวอักษรโค้ดสีสว่าง */
          padding: 0.3rem 0.6rem;
          border-radius: 6px; /* ขอบโค้งโค้ด */
          font-size: 1rem;
          font-family: 'Consolas', monospace; /* ฟอนต์โค้ดสุดคูล */
        }
        em {
          font-style: italic;
          color: #80cbc4; /* เน้นคำด้วยสีสวยๆ */
        }
        .emoji {
          font-size: 2rem; /* อีโมจิใหญ่ๆ สื่ออารมณ์ */
          margin-right: 10px;
        }
      </style>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&family=Consolas&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <h1><span class="emoji">🚀</span> ยินดีต้อนรับสู่จักรวาล Notes API!</h1>
        <p>นี่คือ API สุดเจ๋งที่สร้างด้วย <strong>Express</strong> และพลังของ <strong>LibSQL</strong>.</p>
        <p>อยากลองสร้างโน้ตใหม่ไหม? จัดไปเลยที่ <code>POST /notes</code>! หรือจะสำรวจกาแล็กซีของผู้ใช้งานที่ <code>/users</code> และดูเรื่องราวความสัมพันธ์ระหว่างโน้ตกับผู้สร้างที่ <code>/notes-with-authors</code> ก็ได้นะ!</p>
        <p>ยานสำรวจอวกาศที่คุณต้องการคือ <em>VSCode REST Client</em> หรือ <em>Postman</em> เตรียมพร้อมแล้วก็ลุยเลย!</p>
        <p><span class="emoji">✨</span> ขอให้การโค้ดของคุณเปล่งประกายเหมือนดวงดาว!</p>
      </div>
    </body>
    </html>
  `);
});
// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();
    // await connectTurso();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} ✅`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});
