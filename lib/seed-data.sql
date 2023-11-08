
INSERT INTO Users (username, password) VALUES
    ('TVAddict23', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('BingeWatcher99', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('DramaQueen', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('SciFiGeek', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm'),
    ('ComedyLover', '$2b$10$8RSrrqCM63VXwRa6z4ML0u9sPw7osmgQyl1lktVEHlc0DJSN.KGWm');

INSERT INTO Posts (title, user_id, date) VALUES 
    ('Game of Thrones - Season 8 Discussion', 1, NOW()),
    ('Stranger Things - The Upside Down Theories', 2, NOW()), 
    ('Breaking Bad - Jesse Pinkman''s Redemption', 3, NOW() - INTERVAL '1 day'),  
    ('The Office - Jim and Pam''s Relationship', 4, NOW() - INTERVAL '2 days'),  
    ('Westworld - Exploring AI and Humanity', 5, NOW() - INTERVAL '3 days'),  
    ('The Mandalorian - Baby Yoda Fan Club', 4, NOW() - INTERVAL '4 days'), 
    ('Breaking Bad - Walter White''s Transformation', 1, NOW() - INTERVAL '5 days'),  
    ('Sherlock - Analyzing Detective Work', 2, NOW() - INTERVAL '6 days'),  
    ('Lost - The Island Mysteries', 3, NOW() - INTERVAL '7 days'),  
    ('Chernobyl - The Tragedy and Its Portrayal', 4, NOW() - INTERVAL '8 days'),  
    ('Black Mirror - Technology Dystopia', 5, NOW() - INTERVAL '9 days'), 
    ('The Crown - Royal Drama', 1, NOW() - INTERVAL '10 days'), 
    ('Friends - Timeless Comedy', 2, NOW() - INTERVAL '11 days');  

-- Comments for Post 1 (Game of Thrones)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'I can''t believe how Game of Thrones ended! What a disappointment.', 1, 1),
    (NOW() - INTERVAL '2 days', 'Season 8 had its moments, but overall, I was disappointed too.', 2, 1),
    (NOW() - INTERVAL '3 days', 'The cinematography was still top-notch in Season 8.', 3, 1),
    (NOW() - INTERVAL '4 days', 'I wish they had followed the books more closely.', 4, 1),
    (NOW() - INTERVAL '5 days', 'Who do you think should sit on the Iron Throne at the end?', 5, 1);

-- Comments for Post 2 (Stranger Things)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Stranger Things is such a great show! I have so many theories about the Upside Down.', 1, 2),
    (NOW() - INTERVAL '2 days', 'The kids are amazing actors. Who''s your favorite character?', 2, 2),
    (NOW() - INTERVAL '3 days', 'I think Hopper is still alive. What do you think?', 3, 2),
    (NOW() - INTERVAL '4 days', 'The Duffer Brothers are brilliant storytellers.', 4, 2),
    (NOW() - INTERVAL '5 days', 'I love Eleven and Mike''s relationship. It''s so sweet.', 5, 2),
    (NOW() - INTERVAL '6 days', 'The Demogorgon was a fantastic monster design.', 1, 2),
    (NOW() - INTERVAL '7 days', 'I can''t wait for the next season. When is it coming out?', 2, 2);

-- Comments for Post 3 (Breaking Bad)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Breaking Bad is a rollercoaster of emotions. Walt''s transformation is incredible.', 1, 3),
    (NOW() - INTERVAL '2 days', 'Jesse Pinkman is one of the most sympathetic characters in TV history.', 2, 3),
    (NOW() - INTERVAL '3 days', 'What''s your take on the moral themes in Breaking Bad?', 3, 3),
    (NOW() - INTERVAL '4 days', 'Breaking Bad''s writing and character development are top-notch.', 4, 3),
    (NOW() - INTERVAL '5 days', 'I can''t get enough of Saul Goodman''s wit!', 5, 3),
    (NOW() - INTERVAL '6 days', 'Gus Fring is one of the most menacing villains ever.', 1, 3),
    (NOW() - INTERVAL '7 days', 'The show''s cinematography is fantastic. Thoughts on the visuals?', 2, 3);

-- Comments for Post 4 (The Office)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Jim and Pam are relationship goals. What''s your favorite moment?', 1, 4),
    (NOW() - INTERVAL '2 days', 'I love the pranks Jim plays on Dwight. They''re hilarious!', 2, 4),
    (NOW() - INTERVAL '3 days', 'The Office''s mockumentary style adds a unique charm to the show.', 3, 4),
    (NOW() - INTERVAL '4 days', 'Dunder Mifflin''s quirky employees make the show so entertaining.', 4, 4);

-- Comments for Post 5 (Westworld)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Westworld''s plot twists are incredible. What''s your favorite moment?', 1, 5),
    (NOW() - INTERVAL '2 days', 'I''m fascinated by the ethical dilemmas raised by Westworld.', 2, 5),
    (NOW() - INTERVAL '3 days', 'The host characters in Westworld have such complex storylines.', 3, 5),
    (NOW() - INTERVAL '4 days', 'What''s your take on the concept of AI achieving sentience in Westworld?', 4, 5),
    (NOW() - INTERVAL '5 days', 'Bernard''s character arc is a standout. What do you think of him?', 5, 5),
    (NOW() - INTERVAL '6 days', 'Maeve''s journey in Westworld is empowering. Share your thoughts.', 1, 5);

-- Comments for Post 6 (The Mandalorian)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Baby Yoda is adorable. Who doesn''t love that little guy?', 2, 6),
    (NOW() - INTERVAL '2 days', 'The Mandalorian has some epic action scenes. What''s your favorite?', 3, 6),
    (NOW() - INTERVAL '3 days', 'I can''t wait for the next season of The Mandalorian. What do you expect to happen?', 4, 6),
    (NOW() - INTERVAL '4 days', 'Who do you think "The Child" is, and what''s its role in the story?', 5, 6),
    (NOW() - INTERVAL '5 days', 'The Mandalorian''s music sets the mood perfectly. Your favorite soundtrack?', 1, 6),
    (NOW() - INTERVAL '6 days', 'Greef Karga and Cara Dune are intriguing characters. Thoughts on them?', 2, 6),
    (NOW() - INTERVAL '7 days', 'What do you think about the Mandalorian''s creed and way of life?', 3, 6),
    (NOW() - INTERVAL '8 days', 'What were your favorite moments from the first season?', 4, 6);

-- Comments for Post 7 (Breaking Bad)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Walter White''s transformation from Mr. Chips to Scarface is legendary.', 2, 7),
    (NOW() - INTERVAL '2 days', 'What was your favorite Heisenberg moment in Breaking Bad?', 3, 7),
    (NOW() - INTERVAL '3 days', 'The show''s moral ambiguity keeps you hooked. Thoughts on that?', 4, 7);

-- Comments for Post 8 (Sherlock)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Sherlock Holmes is a genius. The show captures the essence of the character.', 1, 8),
    (NOW() - INTERVAL '2 days', 'Moriarty is one of the best TV villains. What''s your favorite moment with him?', 2, 8),
    (NOW() - INTERVAL '3 days', 'I enjoy the modern take on classic Sherlock stories. Thoughts on the adaptation?', 3, 8),
    (NOW() - INTERVAL '4 days', 'What do you think of the dynamic between Sherlock and Watson?', 4, 8),
    (NOW() - INTERVAL '5 days', 'The show''s deduction sequences are thrilling. Which one stands out to you?', 5, 8);

-- Comments for Post 9 (Lost)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Lost is so mysterious. What do you think the island''s secret is?', 1, 9),
    (NOW() - INTERVAL '2 days', 'The character flashbacks in Lost add depth to the story. Thoughts on them?', 2, 9),
    (NOW() - INTERVAL '3 days', 'The Others are intriguing antagonists. What''s your take on their motivations?', 3, 9),
    (NOW() - INTERVAL '4 days', 'How do you interpret the show''s finale? What do you think it all means?', 4, 9),
    (NOW() - INTERVAL '5 days', 'Lost''s time-travel elements are mind-bending. Share your theories!', 5, 9);

-- Comments for Post 10 (Chernobyl)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'The Chernobyl disaster was a tragedy that''s hard to comprehend. How did it impact you?', 5, 10);

-- Comments for Post 11 (Black Mirror)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Black Mirror is a thought-provoking series about our relationship with technology.', 1, 11);

-- Comments for Post 11 (Black Mirror) - Continued
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '2 days', 'The concept of rating people''s interactions is both absurd and terrifying.', 3, 11),
    (NOW() - INTERVAL '3 days', 'Do you think Black Mirror is a warning or a reflection of our society?', 4, 11),
    (NOW() - INTERVAL '4 days', 'The show''s twists keep you guessing. Which one surprised you the most?', 5, 11),
    (NOW() - INTERVAL '5 days', 'Is there a Black Mirror episode that made you change your behavior?', 1, 11),
    (NOW() - INTERVAL '6 days', 'The "San Junipero" episode is a beautiful and emotional story. Thoughts on it?', 2, 11),
    (NOW() - INTERVAL '7 days', 'If you could rate your life like in "Nosedive," what score would you have?', 3, 11),
    (NOW() - INTERVAL '8 days', 'The future technology in Black Mirror is both fascinating and terrifying.', 4, 11),
    (NOW() - INTERVAL '9 days', 'Which Black Mirror episode would you show someone who''s never seen the series?', 5, 11),
    (NOW() - INTERVAL '10 days', 'How do you think the show''s portrayal of technology has changed over time?', 1, 11);

-- Comments for Post 12 (The Crown)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'The Crown is like a history lesson with drama. Love it!', 5, 12),
    (NOW() - INTERVAL '2 days', 'I''m always amazed by the actors'' performances in The Crown.', 1, 12),
    (NOW() - INTERVAL '3 days', 'What are your thoughts on the portrayal of Princess Diana?', 2, 12),
    (NOW() - INTERVAL '4 days', 'The Crown covers many significant events. Which one stood out to you the most?', 3, 12),
    (NOW() - INTERVAL '5 days', 'I appreciate The Crown''s attention to historical accuracy. It''s impressive.', 4, 12),
    (NOW() - INTERVAL '6 days', 'How do you feel about the depiction of the Queen''s reign through the seasons?', 5, 12),
    (NOW() - INTERVAL '7 days', 'The Crown captures the personal and political life of the royals. Thoughts on that?', 1, 12),
    (NOW() - INTERVAL '8 days', 'Which historical figure in The Crown did you find most interesting?', 2, 12);

-- Comments for Post 13 (Friends)
INSERT INTO Comments (date, markdown_body, user_id, post_id) VALUES
    (NOW() - INTERVAL '1 day', 'Friends is a comfort show. I can watch it over and over again.', 5, 13),
    (NOW() - INTERVAL '2 days', 'The humor in Friends is timeless. Who''s your favorite character?', 1, 13),
    (NOW() - INTERVAL '3 days', 'Ross''s "pivot" moment is iconic. What''s your favorite Friends quote?', 2, 13),
    (NOW() - INTERVAL '4 days', 'I love the Thanksgiving episodes. Which one is your favorite?', 3, 13),
    (NOW() - INTERVAL '5 days', 'Phoebe''s eccentricity adds a unique charm to the group. Thoughts on her?', 4, 13),
    (NOW() - INTERVAL '6 days', 'Friends captured the essence of 90s culture. How does it make you nostalgic?', 5, 13),
    (NOW() - INTERVAL '7 days', 'How do you feel about the "will they, won''t they" dynamic between Ross and Rachel?', 1, 13),
    (NOW() - INTERVAL '8 days', 'Which character''s growth throughout the series impressed you the most?', 2, 13),
    (NOW() - INTERVAL '9 days', 'What would you say is the most iconic moment in Friends history?', 3, 13),
    (NOW() - INTERVAL '10 days', 'Central Perk is such a memorable location. What would you order there?', 4, 13),
    (NOW() - INTERVAL '11 days', 'How has Friends influenced modern sitcoms and pop culture in general?', 5, 13),
    (NOW() - INTERVAL '12 days', 'Did you ever try to recreate any of the recipes from the "Rachel Green" cookbook?', 1, 13),
    (NOW() - INTERVAL '13 days', 'What do you think the Friends characters would be up to in the present day?', 2, 13);
