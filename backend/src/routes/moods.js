import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Moods endpoint ready',
    data: [],
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Mood creation endpoint ready',
    data: null,
  });
});

export default router;