const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Credibanco DevSecOps',
    version: '1.0.0',
    status: 'OK'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/validate', (req, res) => {
  const { value } = req.body;
  
  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }
  
  return res.json({
    validated: true,
    value: value
  });
});

app.get('/api/sum/:a/:b', (req, res) => {
  const a = parseInt(req.params.a, 10);
  const b = parseInt(req.params.b, 10);
  
  return res.json({
    result: a + b,
    a: a,
    b: b
  });
});

app.get('/api/divide/:a/:b', (req, res, next) => {
  const a = parseInt(req.params.a, 10);
  const b = parseInt(req.params.b, 10);
  
  if (b === 0) {
    const error = new Error('Division by zero is not allowed');
    error.statusCode = 400;
    return next(error);
  }
  
  return res.json({
    result: a / b,
    a: a,
    b: b
  });
});

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

// Iniciar servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
}

module.exports = app;
