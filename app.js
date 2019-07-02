///////////////////////////////////////////////////////
// built in
const path = require('path');
const fs = require('fs');
const enforce = require('express-sslify');
// const https = require('https');

// third party
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/asset');
///////////////////////////////////////////////////////

// db
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-20l9d.mongodb.net/${
  process.env.MONGO_DEFAULT_DATABASE
}?retryWrites=true`;
console.log(`MONGODB_URI`, MONGODB_URI);

console.log(`process.env.NODE_ENV`, process.env.NODE_ENV);

const app = express();

// for production(ssl)
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/asset', assetRoutes);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
// third party's middleware for production
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// for production. front + back
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  console.log(`res`, res);
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// db
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // server
    const port = process.env.PORT || 3001;

    /*** for production(ssl)
    const server = https
                    .createServer({key: privateKey, cert: certificate }, app)
                    .listen(port, () => {
                      console.log(`Express server listening on port ${port}`);
                    });
                    ***/

    const server = app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  })
  .catch(error => {
    console.log(`error`, error);
  });
