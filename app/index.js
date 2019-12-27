const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

router.get('/', (_req, res) => {
  res.sendFile(`${path.join(__dirname)}/express/index.html`);
});

router.get('/babylon/', (_req, res) => {
  res.sendFile(`${path.join(__dirname)}/express/babylon.html`);
});

router.get('/script/', (_req, res) => {
  res.sendFile(path.resolve('./dist/main.js'));
});

app.use('/', router);
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
