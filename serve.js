require('dotenv').config();

require('./db');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

// Route api*
require('./routes/api')(app);

app.use('/', require('./routes'));

app.get('/', (req, res) => {
  res.send('Server is active!!!')
})

app.listen(port, () => {
  console.log(`App is listening at ${port}`);

})
