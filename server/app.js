const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const bookingsRouter = require('./routes/bookings')
// const cleanersRouter = require('./routes/cleaners')
const customersRouter = require('./routes/customers')
// const servicesRouter = require('./routes/services')
app.use('/api/bookings', bookingsRouter);
// app.use('/api/cleaners', cleanersRouter)
app.use('/api/customers', customersRouter)
// app.use('/api/services', servicesRouter)

module.exports = app;