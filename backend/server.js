require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV:

app.listen(PORT, () => {

  console.log(`Environment is:${NODE_ENV}`)
  console.log(`Server running on http://localhost:${PORT}`);
});
