
const mongoose = require('mongoose');

const uri = "mongodb+srv://thienbinh7396:qwerty123@cluster0.kqntm.mongodb.net/shopify?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('MongoDb is ready!')
}).catch(err => {
  console.log(err)
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db
