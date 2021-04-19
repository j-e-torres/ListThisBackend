const app = require('./src/config/express');

const { port, env } = require('./src/config/vars');

app.listen(port, () => {
  console.log(`server started on port ${port} in (${env})`);
});
