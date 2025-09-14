import express from 'express';

const app = express();

app.get('/h3al4h', (_req, res) => {
  res.json({ message: 'ok' });
});

export { app };
