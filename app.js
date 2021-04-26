const app = require('./src/config/express');
const sequelize = require('./src/config/sequelize');

const { port, env } = require('./src/config/vars');

sequelize.connect();

if (env !== 'test') {
  app.listen(port, () => {
    console.log(`server started on port ${port} in (${env})`);
  });
}

module.exports = app;
