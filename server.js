const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5500;
const pool = mysql.createPool({
  //local
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "employee",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  
  host: "sql.freedb.tech",
  user: "u_gAb1Kl",
  password: "uoNIBGYM3BHz",
  database: "freedb_sysNNVwh",


});

//REPORT (Read all books)
app.get("/api/books", (req, res) => {
  pool.query("SELECT * FROM books", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

//CREATE (Add a book)
app.post("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year_published = req.body.year_published;
  
  pool.query(
    "INSERT INTO books (title, author, year_published) VALUES (?, ?, ?)",
    [title, author, year_published],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully inserted!` });
    },
  );
});

//SEARCH (Find book by ID)
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "SELECT * FROM books WHERE id = ?", [id], (err, rows, fields) => {
      if (err) throw err;
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(400).json({ msg: `${id} id not found!` });
      }
    },
  );
});

//UPDATE (Update a book)
app.put("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year_published = req.body.year_published;
  const id = req.body.id;

  pool.query(
    "UPDATE books SET title = ?, author = ?, year_published = ? WHERE id = ?",
    [title, author, year_published, id],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully updated` });
    },
  );
});

//DELETE (Delete a book)
app.delete("/api/books", (req, res) => {
  const id = req.body.id;
  pool.query("DELETE FROM books WHERE id = ?", [id], (err, rows, fields) => {
    if (err) throw err;
    res.json({ msg: `Successfully deleted` });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});