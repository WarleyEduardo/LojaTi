const router = require('express').Router();

router.use('/usuarios', require('./usuarios'));

/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/
router.use('/lojas', require('./lojas'));

//  Modulo 7 -  Api Clientes  - Criando rotas para clientes

router.use('/clientes', require('./clientes'));

module.exports = router;
