const express = require('express'); // Requisitando express(Servidor web)
const route = express.Router(); //Essa constante vai ser o "Router"
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const {loginRequired} = require('./src/middlewares/middleware');

//Rotas da home
route.get('/', homeController.index);

//Rotas de Login
route.get('/login/logout', loginController.logout);
route.get('/login/index', loginController.index);
route.get('/login/edit', loginController.edit);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
// route.post('/login/editpassword', loginController.editPassword);

//Rodas de contato
route.get('/contato/index',loginRequired, contatoController.index);
route.post('/contato/register',loginRequired, contatoController.register);
route.get('/contato/index/:id',loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id',loginRequired, contatoController.edit);
route.get('/contato/delete/:id',loginRequired, contatoController.delete);
module.exports = route; 