const express = require('express');
const helmet = require('helmet');
const pino = require('pino')();
// Prometheus client setup
const Prometheus = require('prom-client');
Prometheus.collectDefaultMetrics();


const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.get('/live', (req, res) => res.status(200).json({ status: 'ok' }));


app.get('/metrics', async (req, res, next) => {
   try {
      res.set('Content-Type', Prometheus.register.contentType);
      const metrics = await Prometheus.register.metrics();
      res.end(metrics);
   } catch {
      res.end('');
   }
});



app.get('/', (req, res) => {
   res.send('Hello, World!');
});

app.listen(PORT, () => {
   pino.info(`Server listening on port ${PORT}`);
});

