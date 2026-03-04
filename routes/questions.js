import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all topics
router.get('/topics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM topics');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET questions by difficulty AND topic
router.get('/', async (req, res) => {
  const difficulty = req.query.difficulty || 1;
  const topic_id = req.query.topic_id;

  try {
    let result;
    if (topic_id) {
      result = await pool.query(
        `SELECT q.* FROM questions q
         JOIN subtopics s ON q.subtopic_id = s.id
         WHERE q.difficulty = $1 AND s.topic_id = $2
         ORDER BY RANDOM() LIMIT 5`,
        [difficulty, topic_id]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM questions WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 5',
        [difficulty]
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;