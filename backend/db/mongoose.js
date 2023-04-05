const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/artist-roster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));
