const express = require('express');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const csrfProtection = csrf({ cookie: true });

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
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

fs.readdirSync('./routes').map((r) => {
  app.use('/api', require(`./routes/${r}`));
});

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
