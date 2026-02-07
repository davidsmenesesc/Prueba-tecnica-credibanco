const request = require('supertest');
const app = require('./app');

// Mock console.error para evitar logs en test de división por cero
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Bienvenido a Credibanco DevSecOps - GitOps Pipeline');
    expect(res.body.status).toBe('OK');
  });
});

describe('GET /health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('POST /api/validate', () => {
  it('should validate input with value', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send({ value: 'test' });
    expect(res.statusCode).toBe(200);
    expect(res.body.validated).toBe(true);
    expect(res.body.value).toBe('test');
  });

  it('should reject input without value', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /api/sum/:a/:b', () => {
  it('should return sum of two numbers', async () => {
    const res = await request(app).get('/api/sum/5/3');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(8);
    expect(res.body.a).toBe(5);
    expect(res.body.b).toBe(3);
  });

  it('should handle negative numbers', async () => {
    const res = await request(app).get('/api/sum/-5/10');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  it('should handle zero', async () => {
    const res = await request(app).get('/api/sum/0/0');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(0);
  });
});

describe('GET /api/divide/:a/:b', () => {
  it('should return division of two numbers', async () => {
    const res = await request(app).get('/api/divide/10/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  it('should reject division by zero', async () => {
    const res = await request(app).get('/api/divide/10/0');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Division by zero is not allowed');
  });
});

describe('Error Handling', () => {
  it('should handle 404 errors gracefully', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
