import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Analytics endpoint ready',
    data: {
      totalEntries: 0,
      todayEntries: 0,
      weekEntries: 0,
      mostCommonMood: null,
      moodCounts: {},
    },
  });
});

export default router;