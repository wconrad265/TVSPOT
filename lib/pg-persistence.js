const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PGPersistence {
  constructor(session) {
    this.username = session.username;
    this.userId = session.userId;
  }

  async getMaxPosts(postsPerPagination) {
    const SELECT_ALL_POSTS = "SELECT * FROM posts;";

    const result = await dbQuery(SELECT_ALL_POSTS);

    const maxPosts = result.rowCount;

    return Math.ceil(maxPosts / postsPerPagination);
  }

  async getMaxComments(postId, commentsPerPagination) {
    const SELECT_ALL_COMMENTS = "SELECT * FROM comments WHERE post_id = $1;";

    const result = await dbQuery(SELECT_ALL_COMMENTS, postId);

    const maxComments = result.rowCount;

    return Math.ceil(maxComments / commentsPerPagination);
  }

  async getPostsForPage(pageNumber, postsPerPagination) {
    const startIndex = (pageNumber - 1) * postsPerPagination;

    const SELECT_POSTS = `
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

    const result = await dbQuery(SELECT_POSTS, postsPerPagination, startIndex);

    return result.rows;
  }

  async createPost(forumPostTitle) {
    const INSERT_POST =
      "INSERT INTO posts (title, user_id) VALUES ($1, $2) RETURNING id";

    try {
      const result = await dbQuery(INSERT_POST, forumPostTitle, this.userId);
      return result.rows[0].id;
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) return false;
      throw error;
    }
  }

  async createComment(postId, commentText) {
    const INSERT_COMMENT =
      "INSERT INTO  comments (post_id, markdown_body, user_id) VALUES ($1, $2, $3)";

    const result = await dbQuery(
      INSERT_COMMENT,
      postId,
      commentText,
      this.userId,
    );

    return result.rowCount > 0;
  }

  async getCommentsForPage(postId, pageNumber, commentsPerPagination) {
    const startIndex = (pageNumber - 1) * commentsPerPagination;

    const SELECT_COMMENTS = `
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

    const result = await dbQuery(
      SELECT_COMMENTS,
      postId,
      commentsPerPagination,
      startIndex,
    );

    return result.rows;
  }

  async getComment(commentId) {
    const SELECT_COMMENT = "select markdown_body FROM comments WHERE id = $1";

    const result = await dbQuery(SELECT_COMMENT, commentId);

    return result.rows[0].markdown_body;
  }

  async updateComment(comment, commentId) {
    const UPDATE_COMMENT_TEXT =
      "UPDATE comments SET markdown_body = $1 WHERE id = $2 AND user_id = $3";

    const result = await dbQuery(
      UPDATE_COMMENT_TEXT,
      comment,
      commentId,
      this.userId,
    );

    return result.rowCount > 0;
  }

  async deleteComment(postId, commentId) {
    const DELETE_COMMENT_BY_ID = `DELETE FROM comments WHERE id = $1 AND post_id = $2`;

    const result = await dbQuery(DELETE_COMMENT_BY_ID, commentId, postId);

    return result.rowCount > 0;
  }

  async getPostTitle(postId) {
    const SELECT_POST_TITLE = `SELECT title FROM posts where id = $1`;

    const result = await dbQuery(SELECT_POST_TITLE, postId);

    return result.rows[0].title;
  }

  async getUserId(username) {
    const SELECT_USER_ID = "SELECT id FROM users WHERE username = $1";

    const result = await dbQuery(SELECT_USER_ID, username);

    return result.rows[0].id;
  }

  async getUserPosts() {
    const SELECT_USER_POSTS = `      
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

    const result = await dbQuery(SELECT_USER_POSTS, this.userId);

    return result.rows;
  }

  async deletePost(postId) {
    const DELETE_POST_BY_ID = `DELETE FROM posts WHERE id = $1 AND user_id = $2;`;

    const result = await dbQuery(DELETE_POST_BY_ID, postId, this.userId);

    return result.rowCount > 0;
  }

  async existsForumPostTitle(forumPostTitle) {
    const SELECT_POST_TITLE = "SELECT null from posts WHERE title = $1";

    const result = await dbQuery(SELECT_POST_TITLE, forumPostTitle);

    return result.rowCount > 0;
  }

  async editPostTitle(forumPostTitle, postId) {
    const UPDATE_POST_TITLE =
      "UPDATE posts SET title = $1 WHERE id = $2 AND user_id = $3";

    const result = await dbQuery(
      UPDATE_POST_TITLE,
      forumPostTitle,
      postId,
      this.userId,
    );

    return result.rowCount > 0;
  }

  async getPostUserId(postId) {
    const SELECT_POST_USER_ID = "SELECT user_id FROM posts WHERE ID = $1";

    const result = await dbQuery(SELECT_POST_USER_ID, postId);

    return result.rows[0].user_id;
  }

  async getCommentUserId(commentId) {
    const SELECT_COMMENT_USER_ID = "SELECT user_id FROM comments WHERE ID = $1";

    const result = await dbQuery(SELECT_COMMENT_USER_ID, commentId);

    return result.rows[0].user_id;
  }

  async authenticate(username, password) {
    const SELECT_HASHED_PASSWORD =
      "SELECT password FROM users WHERE username = $1";

    const result = await dbQuery(SELECT_HASHED_PASSWORD, username);
    if (result.rowCount === 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }

  async isUniqueConstraintViolation(error) {
    return /duplicate key value violates unique constraint/.test(String(error));
  }
};
