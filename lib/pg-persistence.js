const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PGPersistence {

  async getMaxPageNumber(postsPerPage) {
    const TOTAL_POSTS = "SELECT * FROM posts;"

    let result = await dbQuery(TOTAL_POSTS);

    let maxPosts = result.rowCount;
  
    return Math.ceil(maxPosts / postsPerPage);
  }

  async getPostsForPage(pageNumber, postsPerPage) {
    const startIndex = (pageNumber - 1) * postsPerPage;
  
    const GET_POSTS = `
      SELECT
        p.id,
        p.title,
        p.date,
        CASE
          WHEN p.date::date = CURRENT_DATE THEN 'today'
          WHEN p.date::date = CURRENT_DATE - interval '1 day' THEN 'yesterday'
          ELSE to_char(p.date, 'YYYY-MM-DD, HH12:MI AM')
        END AS formatted_date,
        (SELECT username FROM users u WHERE u.id = p.user_id) AS username
      FROM posts p
      ORDER BY p.date DESC
      LIMIT $1 OFFSET $2;
    `;
  
    const result = await dbQuery(GET_POSTS, postsPerPage, startIndex);
  
    return result.rows;
  }

  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";

    let result = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (result.rowCount === 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }

  
};