const { app, syncDatabase } = require('./app.js');
const { PORT } = require('./config/config.js');

syncDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`)
    });
});
