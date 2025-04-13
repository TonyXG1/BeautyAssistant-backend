import express from "express";
import db from "./db.js";
import bodyParser from "body-parser";
import cors from "cors";
import loginRegister from "./routes/loginRegister.js";
import { createServer } from "http";
import { initializeChat } from "./chat.js";

const app = express();
const PORT = 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", loginRegister);

const server = createServer(app);
initializeChat(server);

app.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log("Hello, World!");
});

app.get("/skinRoutine", (req, res) => {
  const id = req.query.userId; // User's id
  try {
    const sql = `SELECT srt.dayRoutine, srt.nightRoutine
    FROM skinRoutineTips srt
    WHERE srt.skinType = (SELECT skinType FROM users WHERE id = ?)
    AND srt.concerns = (SELECT concerns FROM users WHERE id = ?)
    AND srt.ageGroup = (
    SELECT CASE
        WHEN age BETWEEN 16 AND 25 THEN '16-25'
        WHEN age BETWEEN 26 AND 40 THEN '26-40'
        WHEN age BETWEEN 41 AND 60 THEN '41-60'
        WHEN age BETWEEN 61 AND 100 THEN '61-100'
    END
    FROM users
    WHERE id = ?);`;

    db.query(sql, [id, id, id], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Няма подходяща рутина!" });
      }
      console.log(results[0]);
      return res.status(200).json({ routine: results[0] });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/makeupRoutine", (req, res) => {
  const id = req.query.userId;
  try {
    const sql = `SELECT mt.everyDayMakeup, mt.nightMakeup, mt.weddingMakeup
    FROM users u
    JOIN makeupTips mt 
      ON mt.skinTone = u.skinTone
        AND mt.faceShape = u.faceShape
        AND mt.eyeColor = u.eyeColor
        AND mt.hairColor = u.hairColor
        AND mt.ageGroup = (
      CASE
          WHEN u.age BETWEEN 16 AND 25 THEN '16-25'
          WHEN u.age BETWEEN 26 AND 40 THEN '26-40'
          WHEN u.age BETWEEN 41 AND 60 THEN '41-60'
          WHEN u.age BETWEEN 61 AND 100 THEN '61-100'
      END
    )
    WHERE u.id = ?;`;

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Няма подходящ грим!" });
      }
      console.log(results[0]);
      return res.status(200).json({ makeup: results[0] });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/setReminders", (req, res) => {
  const { userId, reminders } = req.body;
  // console.log(userId);
  // console.log(reminders);

  try {
    const updateSql =
      "UPDATE users SET morningReminder = ?, nightReminder = ? WHERE id = ?;";
    db.query(
      updateSql,
      [reminders.morningReminder, reminders.nightReminder, userId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: err.message });
        }
        console.log(`Reminders updated for user ID: ${userId}`);
        return res
          .status(200)
          .json({ message: "Reminders updated succesfully!" });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/reminders", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const sql = "SELECT morningReminder, nightReminder FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = results[0];
      console.log("Morning Reminder:", user.morningReminder);
      console.log("Night Reminder:", user.nightReminder);
      return res.status(200).json({
        morningReminder: user.morningReminder
          ? user.morningReminder.slice(0, 5)
          : null,
        nightReminder: user.nightReminder
          ? user.nightReminder.slice(0, 5)
          : null,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
