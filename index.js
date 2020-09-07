const app = require('./app');
const PORT = process.env.PORT | 6161;

app.listen(PORT, () => console.log(`Server has been started`));

