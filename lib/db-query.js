const config = require("./config");
const { Client } = require("pg");

const logQuery = (statement, parameters) => {
  const timestamp = new Date();
  const formattedTimeStamp = timestamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

const CONNECTION = {
  connectionString: config.DATABASE_URL,
  ssl: false,
  // ssl: { rejectUnauthorized: false },
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    const client = new Client(CONNECTION);

    await client.connect();
    logQuery(statement, parameters);
    const result = await client.query(statement, parameters);
    await client.end();

    return result;
  },
};
