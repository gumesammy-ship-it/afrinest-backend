const express = require("express");
const app = express();

app.use(express.json());

let listings = [];

app.get("/", (req, res) => {
  res.send("AfriNest API is running 🚀");
});

app.get("/listings", (req, res) => {
  res.json(listings);
});

app.post("/listings", (req, res) => {
  const listing = req.body;
  listings.push(listing);
  res.json({ message: "Annonce ajoutée", listing });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
