//DOT ENV PARA ENVIO DE SENHA DO MONGODB
require('dotenv').config();

//DECLARANDO TODAS AS CONTANTES
const express = require('express');// Requisitando express(Servidor web)
const app = express(); //Atribuindo express(Servidor web)
const mongoose = require('mongoose');//Para interagir com MongoDB
const session = require('express-session');//Para dados de sessao do express
const MongoStore = require('connect-mongo');//Usado p/ salvar sessoes no BD e nao na memoria
const flash = require('connect-flash');//Mensagens salvas do tipo flash
const routes = require('./routes'); //Requerindo arquivo de rotas
const path = require('path'); //Resolvedor de caminhos absolutos
// const helmet = require('helmet');//Pacote de seguranca do express recomendado
const csrf = require('csurf');//Pacote de seguranca de tokens dentro da aplicacao
const sessionOptions = session({
    secret: 'dsjdsjdhsdjhdjdjsdifiqwbrwqenvoidhsv',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
const { middleWareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');//Pegando middleWares
const favicon = require('serve-favicon');

app.use(express.urlencoded({extended: true})); // Postar formularios p/ dentro da aplicacao (req.body)
app.use(express.json()); //Permite uso de JSON dentro da aplicacao

//CONECTANDO AO MONGO DB
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Conectei a base de dados')
        app.emit('Pronto');
    })
    .catch(e => console.log(e));

//PACOTES A SEREM USADOS NO EXPRESS(app.use)    
app.use(sessionOptions);
app.use(flash());
//Dizendo que será usado o arquivo de rotas que declaramos mais a cima
//Setando no express que a pasta de views está em src/views
app.set('views', path.resolve(__dirname, 'src', 'views'));
//Setando a engine do views para ejs
app.set('view engine', 'ejs');
//Apontando o caminho dos arquivos estáticos
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(helmet()); //Habilitar apenas em producao, nao usar em 127.0.0.1/localhost ou IP sem uso de SSL, impede de carregar o bundle.js corretamente
app.use(csrf());
app.use(middleWareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);
//Quanto pegar o sinal "Pronto" ele libera para ouvir na porta 4000
app.on('Pronto', () => {
    //Abrindo socket do servidor web na porta 3000
    app.listen(4000, () => {
        console.log('Servidor executando na porta 4000')
        console.log('Acesse em: http://localhost:4000')
    });
});