const express = require('express');

const app = express();

const scriptRoutes = require('./routes/script');

app.use(express.json());


// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
// ROUTES
app.use('/api/script', scriptRoutes);

module.exports = app;