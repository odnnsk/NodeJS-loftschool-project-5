const mongoose = require('mongoose');
// const config = require('./config.json');

// Use native promises
mongoose.Promise = global.Promise; // es6 promise


const dbConnect = {
	protocol: process.env.DB_PROTOCOL,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	name: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
};

//DB Connection url string
const connectionURL = `${dbConnect.protocol}://${dbConnect.user}:${dbConnect.password}@${dbConnect.host}${ dbConnect.port ? `:${dbConnect.port}` : '' }/${dbConnect.name}?retryWrites=true&w=majority`;

mongoose.set('useCreateIndex', true);

mongoose.connect(connectionURL, { useNewUrlParser: true })
  .catch((e) => console.error(e));
const db = mongoose.connection;

require('./models/user.js');
require('./models/news.js');

// Check connection
db.on('connected', () => {
  console.log(`Mongoose connection open  on ${connectionURL}`)
});

// Check for Db errors
db.on('error', (err) => console.error(err));

// Check for disconected
db.on('disconnected', () => {
  console.log('mongoose connection disconnected')
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('mongoose connection closed throw app terminatatnio');
    process.exit(0);
  });
});
