import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend service placeholder is running.' });
});

app.listen(PORT, () => {
  console.log(`Backend server placeholder listening on port ${PORT}`);
});
