const express = require('express');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => console.log(`Database error: ${err}`));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

fs.readdirSync('./routes').map((r) => {
  app.use('/api', require(`./routes/${r}`));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
