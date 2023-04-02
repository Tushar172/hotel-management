const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

dotenv.config();
