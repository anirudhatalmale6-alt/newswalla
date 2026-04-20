import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

// POST /api/contact - public, no auth needed
router.post('/', async (req: Request, res: Response) => {
  try {
    const input = contactSchema.parse(req.body);
    const { run } = await import('../config/database');
    const id = uuidv4();
    run(
      'INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [id, input.name, input.email, input.subject, input.message]
    );
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
