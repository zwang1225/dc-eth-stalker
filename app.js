const express = require("express");
const {startDiscordBot} = require("./untils/discord.js");
const {schedulerScaner} = require("./untils/scheduler.js")
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  startDiscordBot();
  schedulerScaner();
  console.log(`Example app listening at http://localhost:${port}`);
});
