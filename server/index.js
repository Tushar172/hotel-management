const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3333;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
