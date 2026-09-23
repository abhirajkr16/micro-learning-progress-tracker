require("dotenv").config();

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

module.exports = {
  PORT,
  DATABASE_URL,
};
