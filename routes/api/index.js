const fs = require('fs');

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if(file !== 'index.js'){
      app.use('/api', require(`./${file}`))
    }
  });
}

