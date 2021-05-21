const express = require("express");
const startDC = require("./untils/discord.js");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  startDC();
  console.log(`Example app listening at http://localhost:${port}`);
});
