import express from 'express';
import pool from '../db.js';

const router = express.Router();

// SAVE progress
router.post('/', async (req, res) => {
  const { user_id, question_id, is_correct } = req.body;
  try {
    await pool.query(
      'INSERT INTO user_progress (user_id, question_id, is_correct) VALUES ($1, $2, $3)',
      [user_id, question_id, is_correct]
    );
    res.json({ message: 'Progress saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET progress for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) AS total_attempted,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS total_correct,
        ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS accuracy
       FROM user_progress 
       WHERE user_id = $1`,
      [user_id]
    );

    const history = await pool.query(
      `SELECT q.question_text, up.is_correct, up.attempted_at
       FROM user_progress up
       JOIN questions q ON up.question_id = q.id
       WHERE up.user_id = $1
       ORDER BY up.attempted_at DESC
       LIMIT 10`,
      [user_id]
    );

    res.json({
      stats: result.rows[0],
      history: history.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;