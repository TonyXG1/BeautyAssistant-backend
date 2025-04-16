import mysql from "mysql2";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "beautyassistant",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});
export default db;
