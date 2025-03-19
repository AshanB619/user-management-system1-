const mysql = require("mysql2/promise");

let pool = null;

const ConnectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      if (!pool) {
        pool = await mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          waitForConnections: Boolean(process.env.DB_WAITFORCONNECTIONS),
          connectionLimit: Number(process.env.DB_CONNECTIONLIMIT),
          queueLimit: Number(process.env.DB_QUEUELIMIT),
        });

        console.log("✅ MySQL Database connected successfully.");
        break; // Exit the retry loop
      }
    } catch (error) {
      console.error(`❌ Database connection failed (Attempt ${attempt + 1} of ${maxRetries}):`, error);
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }

  if (!pool) {
    console.error("❌ Failed to connect to MySQL after multiple attempts.");
    process.exit(1);
  }

  return pool;
};

module.exports = ConnectDB;
