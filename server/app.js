const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/cleaners', require('./routes/cleaners'))
app.use('/api/customers', require('./routes/customers'))
app.use('/api/services', require('./routes/services'))

module.exports = app;