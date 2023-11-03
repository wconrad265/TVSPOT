-- Insert sample user data
INSERT INTO Users (username, password) VALUES
  ('johndoe', 'password1'),
  ('janedoe', 'password2'),
  ('tvlover123', 'password3'),
  ('moviebuff456', 'password4'),
  ('popcornfanatic', 'password5'),
  ('seriesaddict', 'password6'),
  ('cinephile22', 'password7'),
  ('watchingtv', 'password8'),
  ('binger123', 'password9'),
  ('tvjunkie', 'password10'),
  ('filmcritic', 'password11'),
  ('streamer1', 'password12'),
  ('tvgeek', 'password13'),
  ('popculturelover', 'password14'),
  ('tvobsessed', 'password15');

-- Insert sample post data
INSERT INTO Posts (title, date, user_id) VALUES
  ('Favorite TV Shows of 2022', NOW(), 1),
  ('Recommendations Needed', NOW(), 2),
  ('Game of Thrones Finale Discussion', NOW(), 3),
  ('Best TV Villains', NOW(), 4),
  ('Netflix vs. Prime Video', NOW(), 5),
  ('Marvel Cinematic Universe', NOW(), 6),
  ('Oscar Nominations 2023', NOW(), 7),
  ('TV Show Endings', NOW(), 8),
  ('Binge-Watching Strategies', NOW(), 9),
  ('TV News and Gossip', NOW(), 10),
  ('Top TV Shows for Sci-Fi Fans', NOW(), 11),
  ('Streaming Originals', NOW(), 12),
  ('Hidden Gems on TV', NOW(), 13),
  ('Pop Culture Phenomenon', NOW(), 14),
  ('TV Collectibles and Merchandise', NOW(), 15);
