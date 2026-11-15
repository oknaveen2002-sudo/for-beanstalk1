const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the GitHub -> Jenkins -> Elastic Beanstalk pipeline!',
    version: process.env.APP_VERSION || '1.0.0',
    time: new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

module.exports = app;
