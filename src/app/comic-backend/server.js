const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default XAMPP MySQL user
  password: "", // Default XAMPP MySQL password
  database: "comic_store",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Fetch all comics with their pages
app.get("/api/comics", (req, res) => {
  const sql = `
    SELECT c.id AS comic_id, c.title, c.author, c.pages, p.page_number, p.imageURL
    FROM comics c
    LEFT JOIN pages p ON c.id = p.comic_id
    ORDER BY c.id, p.page_number
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching comics:", err);
      res.status(500).json({ error: "Failed to fetch comics" });
    } else {
      // Group pages by comic
      const comics = [];
      let currentComic = null;
      result.forEach((row) => {
        if (!currentComic || currentComic.id !== row.comic_id) {
          currentComic = {
            id: row.comic_id,
            title: row.title,
            author: row.author,
            pages: row.pages,
            imagePages: [],
          };
          comics.push(currentComic);
        }
        if (row.imageURL) {
          currentComic.imagePages.push({
            pageNumber: row.page_number,
            imageURL: row.imageURL,
          });
        }
      });
      res.status(200).json(comics);
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});