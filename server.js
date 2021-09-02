require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');

const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const csrf = require('csurf');

const sessionOptions = session({
  secret: 'dsjdsjdhsdjhdjdjsdifiqwbrwqenvoidhsv',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
const favicon = require('serve-favicon');
const {
  middleWareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require('./src/middlewares/middleware');
const routes = require('./routes');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Conectei a base de dados');
    app.emit('Pronto');
  })
  .catch((e) => console.log(e));

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(csrf());
app.use(middleWareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('Pronto', () => {
  app.listen(4000, () => {
    console.log('Servidor executando na porta 4000');
    console.log('Acesse em: http://localhost:4000');
  });
});
