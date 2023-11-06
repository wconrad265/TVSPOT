const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PGPersistence {
  constructor(session) {
    this.username = session.username;
    this.userId = session.userId;
  }

  async getMaxPosts(postsPerPage) {
    const TOTAL_POSTS = "SELECT * FROM posts;"

    let result = await dbQuery(TOTAL_POSTS);

    let maxPosts = result.rowCount;
  
    return Math.ceil(maxPosts / postsPerPage);
  }

  async getMaxComments(postId, postsPerPage) {
    const TOTAL_COMMENTS = "SELECT * FROM comments WHERE post_id = $1;"

    let result = await dbQuery(TOTAL_COMMENTS, postId);

    let maxComments = result.rowCount;
  
    return Math.ceil(maxComments / postsPerPage);
  }

  async getPostsForPage(pageNumber, postsPerPage) {
    let startIndex = (pageNumber - 1) * postsPerPage;
  
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

  async createPost(postTitle) {
    let CREATE_POST = 'INSERT INTO posts (title, user_id) VALUES ($1, $2) RETURNING id';

    try {
      let result = await dbQuery(CREATE_POST, postTitle, this.userId);
      return result.rows[0].id;
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) return false;
      throw error;
    }
  }

  async createComment(postId, commentText) {
    let CREATE_COMMENT = 'INSERT INTO  comments (post_id, markdown_body, user_id) VALUES ($1, $2, $3)';

    let result = await dbQuery(CREATE_COMMENT, postId, commentText, this.userId);

    return result.rowCount > 0;
  }

  async getCommentsForPage(postId, pageNumber, commentsPerPage) {
    let startIndex = (pageNumber - 1) * commentsPerPage;

    const GET_COMMENTS = `
      SELECT 
        c.id,
        c.date, 
        c.markdown_body,  
        (SELECT username from users u WHERE u.id = c.user_id) as username,
        c.date,
        c.user_id
      FROM comments c
      WHERE post_id = $1
      ORDER BY c.date ASC
      LIMIT $2 OFFSET $3;
    `;

    let result = await dbQuery(GET_COMMENTS, postId, commentsPerPage, startIndex);

    return result.rows;
  }

  async getComment(commentId) {
    let GET_COMMENT = "select markdown_body FROM comments WHERE id = $1"

    let result = await dbQuery(GET_COMMENT, commentId);

    return result.rows[0].markdown_body;
  }

  async updateComment(comment, commentId) {
    let UPDATE_COMMENT = "UPDATE comments SET markdown_body = $1 WHERE id = $2 AND user_id = $3";

    let result = await dbQuery(UPDATE_COMMENT, comment, commentId, this.userId);

    return result.rowCount > 0;
  }

  async deleteComment(post_id, commentId) {
    const DELETE_COMMENT = `DELETE FROM comments WHERE id = $1 AND post_id = $2`;

    let result = await dbQuery(DELETE_COMMENT, commentId, post_id);

    return result.rowCount > 0;
    
  }

  async getPostTitle(postId) {
    const GET_POST_TITLE = `SELECT title FROM posts where id = $1`;

    let result = await dbQuery(GET_POST_TITLE, postId);

    return result.rows[0].title;

  }

  async getUserId(username) {
    const FIND_USER_ID = 'SELECT id FROM users WHERE username = $1';

    let result = await dbQuery(FIND_USER_ID, username);

    return result.rows[0].id;

  }

  async getUserPosts() {
    const GET_USER_POSTS = `      
      SELECT
        p.id,
        p.title,
        p.date,
        CASE
          WHEN p.date::date = CURRENT_DATE THEN 'today'
          WHEN p.date::date = CURRENT_DATE - interval '1 day' THEN 'yesterday'
          ELSE to_char(p.date, 'YYYY-MM-DD, HH12:MI AM')
        END AS formatted_date
      FROM posts p
      WHERE p.user_id = $1
    `;

    let result = await dbQuery(GET_USER_POSTS, this.userId);

    return result.rows;
  }

  async deletePost(postId) {
    const DELETE_POST = `DELETE FROM posts WHERE id = $1;`;

    let result = await dbQuery(DELETE_POST, postId);

    return result.rowCount > 0;
  }

  async existsForumPostTitle(postTitle) {
    let FIND_POST_TITLE = 'SELECT null from posts WHERE title = $1';

    let result = await dbQuery(FIND_POST_TITLE, postTitle);

    return result.rowCount > 0;
  }

  async editPostTitle(postTitle, postId) {
    let UPDATE_POST = 'UPDATE posts SET title = $1 WHERE id = $2 AND user_id = $3';

    let result = await dbQuery(UPDATE_POST, postTitle, postId, this.userId);

    return result.rowCount > 0;
  }

  async getPostUserId(postId) {
    let GET_POST_USER_ID = "SELECT user_id FROM posts WHERE ID = $1";

    let result = await dbQuery(GET_POST_USER_ID, postId);

    return result.rows[0].user_id;
  }

  async getCommentUserId(commentId) {
    let GET_COMMENT_USER_ID = "SELECT user_id FROM comments WHERE ID = $1";

    let result = await dbQuery(GET_COMMENT_USER_ID, commentId);

    return result.rows[0].user_id;
  }
  
  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";

    let result = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (result.rowCount === 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }

  async isUniqueConstraintViolation(error) {
    return /duplicate key value violates unique constraint/.test(String(error));
  }

};