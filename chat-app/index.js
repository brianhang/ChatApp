const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const dist = path.join(__dirname, 'dist');
const port = 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(dist));

app.get('/*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});