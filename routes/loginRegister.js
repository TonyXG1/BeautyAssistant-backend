import express, { response } from "express";
import db from "../db.js";
const router = express.Router();

router.post("/register", (req, res) => {
  const userData = req.body;
  //Check if the current email currently exist
  const checkemailSql = "SELECT * from users WHERE email = ?;";

  try {
    db.query(checkemailSql, [userData.email], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        console.log({ error: "Email already exists" });
        return res.status(400).json({ error: "Имейлът вече същестува!" });
      }

      const sql =
        "INSERT INTO users (firstName, lastName, email, password, age, skinType, skinTone, concerns, experience, faceShape, eyeColor, hairColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      db.query(
        sql,
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
          userData.age,
          userData.skinType,
          userData.skinTone,
          userData.concerns,
          userData.experience,
          userData.faceShape,
          userData.eyeColor,
          userData.hairColor,
        ],
        (err, results) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
          } else {
            console.log(`Sucessfully inserted user '${userData.firstName}'`);
            return res
            .status(200)
            .json({ message: "Успешна регистрация!"});
          }
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const sql = "SELECT * from users WHERE email = ? AND password = ?;";
  db.query(sql, [email, password], (err, results) => {
    //TODO
    if (err) {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Грешна парола или имейл!" });
    }
    return res
      .status(200)
      .json({ message: "Успешен вход!", user: results[0] });
  });
  return;
});

export default router;
