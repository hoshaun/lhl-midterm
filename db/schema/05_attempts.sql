DROP TABLE IF EXISTS attempts CASCADE;

CREATE TABLE attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  url VARCHAR(255) UNIQUE NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL
);