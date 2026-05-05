require("dotenv").config();

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.POSTGRES_URI;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URI");
}

// Prisma requires a Postgres adapter when creating PrismaClient
const adapter = new PrismaPg({ connectionString });

let opts; // set logging options based on environment
if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
  opts = { log: ["query"] }; // Prisma will log every SQL query
} else {
  opts = {}; // no logging in production
}

// creates one shared instance of PrismaClient for the entire app
// app uses it to interact with the database using JS instead of SQL
const prisma = new PrismaClient({ adapter, ...opts });

module.exports = prisma;
