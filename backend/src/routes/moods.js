import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { createMoodSchema } from '../schemas/moodSchema.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Moods endpoint ready',
    data: [],
  });
});

router.post('/', validate(createMoodSchema), (req, res) => {
  res.status(201).json({
    message: 'Mood created successfully',
    data: req.validatedBody,
  });
});

export default router;