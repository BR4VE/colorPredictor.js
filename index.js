const express = require("express");
const network = require("./network");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // render the page with random color
  // make a guess about it
  // send the prediction and the color to the client
  let randomColor = network.randomColor();
  network.whichColor(randomColor, guessColor => {
    res.render("index", { randomColor, guessColor });
  })
});

app.post("/train", (req, res) => {
  // train the incoming model
  network.addNewDot(req.body);
});

app.listen(3000, () => {
  console.log("Listening port 3000");
})
