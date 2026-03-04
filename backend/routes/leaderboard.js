import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.username,
        u.avatar,
        COUNT(*) AS total_attempted,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) AS total_correct,
        ROUND(SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS accuracy
       FROM user_progress up
       JOIN users u ON up.user_id = u.id
       GROUP BY u.id, u.username, u.avatar
       ORDER BY total_correct DESC, accuracy DESC
       LIMIT 5`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;