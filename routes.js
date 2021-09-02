const express = require('express');

const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const eventsController = require('./src/controllers/eventsController');

const { loginRequired } = require('./src/middlewares/middleware');

route.get('/', homeController.index);

route.get('/login/logout', loginController.logout);
route.get('/login/index', loginController.index);
route.get('/login/edit', loginController.edit);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.post('/login/editpassword', loginRequired, loginController.editPassword);

route.get(
  '/events/create/:eventDate/:date/:eventDateTermino',
  loginRequired,
  eventsController.index,
);
route.post('/events/create', loginRequired, eventsController.create);
route.get('/myevents/', loginRequired, eventsController.read);
route.get('/events/update/:id', loginRequired, eventsController.updateIndex);
route.put('/events/update/:id', loginRequired, eventsController.update);
route.delete('/events/delete/:id', loginRequired, eventsController.delete);

module.exports = route;
