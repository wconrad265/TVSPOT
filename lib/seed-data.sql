INSERT INTO Users (username, password) VALUES
    ('tvaddict23', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('bingewatcher99', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('dramaqueen', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('scifigeek', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('comedylover', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm');

INSERT INTO Posts (title, user_id, date) VALUES 
    ('Stranger Things - The Upside Down Theories', 2, NOW()), 
    ('Breaking Bad - Jesse Pinkman''s Redemption', 3, NOW() - INTERVAL '1 day'),  
    ('The Office - Jim and Pam''s Relationship', 4, NOW() - INTERVAL '2 days'),  
    ('Black Mirror - What is your favorite Episode?', 1, NOW() - INTERVAL '5 days'),  
    ('The Crown - Royal Drama', 1, NOW() - INTERVAL '10 days'), 
    ('Introduce yourself!', 2, NOW() - INTERVAL '11 days');  

-- Introduce Yourself
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '7 day', 'Hi Everyone! Welcome to the forum! I made this post so you all can introduce yourself!', 2, 6),
    (NOW() - INTERVAL '6 days', 'Nice to meet you all, and glad to be here!', 1, 6),
    (NOW() - INTERVAL '5 days', 'Likewise! I am glad I found this forum, and this nice community I can discuss my favorite TV Shows with.', 2, 6),
    (NOW() - INTERVAL '4 days', 'Same! Glad to be here as well!', 3, 6),
    (NOW() - INTERVAL '3 days', 'HI! I AM SO HAPPY TO BE HERE, AND MEET YOU ALL', 4, 6),
    (NOW() - INTERVAL '2 days', 'Let''s try not and talk in all caps like the comment above! I feel like your yelling!', 5, 6),
    (NOW() - INTERVAL '1 days', 'Sorry my caps locks was stuck XD', 4, 6);


-- Comments for (Stranger Things)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '7 day', 'I just finished watching Stranger Things. The Upside Down is so intriguing! Anyone else have theories?', 1, 1),
    (NOW() - INTERVAL '6 days', 'I have a theory that it’s a parallel universe that mirrors our own, but with a dark twist. What do you think?', 2, 1),
    (NOW() - INTERVAL '5 days', 'It is actually a future state of their town, affected by some sort of disaster or experiment gone wrong. It’s just a theory though!', 3, 1),
    (NOW() - INTERVAL '4 days', 'I think it might be an alternate dimension that exists in the same physical space as our world, but on a different plane.', 4, 1),
    (NOW() - INTERVAL '3 days', 'Can’t wait to see if the next season sheds more light on it!', 5, 1),
    (NOW() - INTERVAL '2 days', 'Yes, I love Stranger Things!', 1, 1),
    (NOW() - INTERVAL '1 days', 'I''m eagerly waiting for the next season. Any idea when it''s releasing?', 2, 1);

-- Comments for(Breaking Bad)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '7 days', 'What a transformation by Jessie!', 1, 2),
    (NOW() - INTERVAL '6 days', 'Jesse Pinkman really tugs at your heartstrings, doesn''t he?', 2, 2),
    (NOW() - INTERVAL '5 days', 'The show really makes you question morality, doesn''t it?', 3, 2),
    (NOW() - INTERVAL '4 days', 'I just finished this show, what a wild ride!', 4, 2),
    (NOW() - INTERVAL '3 days', 'Enough about Jessie, can we talk about how awesome Saul is!', 5, 2),
    (NOW() - INTERVAL '2 days', 'I love Saul''s lines! I hope we see more of him, maybe in another show??', 1, 2),
    (NOW() - INTERVAL '1 day', 'We should get this conversation back on track, don''t you think?', 2, 2);

-- Comments for (The Office)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '4 days', 'Jim and Pam are the cutest, aren''t they? What''s everyone''s favorite JAM moment?', 1, 3),
    (NOW() - INTERVAL '3 days', 'there are so many great moments! I find myself watching them on youtube all the time! ', 2, 3),
    (NOW() - INTERVAL '2 days', 'My favorite JAM moment has to be when Jim confesses his love for Pam in the rain. It was so heartfelt.”', 3, 3),
    (NOW() - INTERVAL '1 day', '“Yes, they are! My favorite is when they prank Dwight together. It’s not just romantic but also shows their fun side.”', 4, 3);
    
-- Comments for (Black Mirror) - Continued
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '10 days', 'The concept of rating people''s interactions is both absurd and terrifying.', 3, 4),
    (NOW() - INTERVAL '9 days', 'I absolutely love ‘San Junipero’. The concept of a virtual afterlife was so thought-provoking and the ending was unexpectedly uplifting.', 4, 4),
    (NOW() - INTERVAL '8 days', 'My favorite has to be ‘White Christmas’. The twist at the end was mind-blowing and it really made me think about the ethics of technology', 5, 4),
    (NOW() - INTERVAL '7 days', 'I really enjoyed ‘Nosedive’. It’s a chilling commentary on social media obsession and the performance by Bryce Dallas Howard was phenomenal.', 1, 4),
    (NOW() - INTERVAL '6 days', 'The Entire History of You’ is my favorite. The idea of being able to replay memories is fascinating but the episode shows how it can also be destructive.', 2, 4),
    (NOW() - INTERVAL '5 days', 'If you could rate your life like in "Nosedive," what score would you have?', 3, 4),
    (NOW() - INTERVAL '4 days', 'I would give myself a perfect 10/10 :)', 4, 4),
    (NOW() - INTERVAL '3 days', 'Which Black Mirror episode would you show someone who''s never seen the series?', 5, 4),
    (NOW() - INTERVAL '2 days', 'I think any of the episodes listed would be a fantastic place to start!', 1, 4);

-- Comments for (The Crown)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '8 days', 'Is this anyone else''s favorite show!', 1, 5),
    (NOW() - INTERVAL '7 days', 'I love it as well! Especially the outfits and attention to detail!', 4, 5),
    (NOW() - INTERVAL '6 days', 'They got the perfect actors for this show, didn''t they!', 5, 5),
    (NOW() - INTERVAL '5 days', 'They totally did', 1, 5),
    (NOW() - INTERVAL '4 days', 'I now know what I am going to watch next! ', 2, 5),
    (NOW() - INTERVAL '3 days', 'I can''t wait for you to watch it!', 3, 5),
    (NOW() - INTERVAL '2 days', 'Let us know what you think of it! I can'' wait to hear your thoughts! ', 4, 5);
