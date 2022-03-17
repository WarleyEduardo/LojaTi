const router = require('express').Router();

router.use('/usuarios', require('./usuarios'));

/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/
router.use('/lojas', require('./lojas'));

//  Modulo 7 -  Api Clientes  - Criando rotas para clientes

router.use('/clientes', require('./clientes'));

// Modulo 8 - Api categorias - Criando rotas

router.use('/categorias', require('./categorias'));

// Modulo 9 - Api produtos -  Criando rotas

router.use('/produtos', require('./produtos'));

module.exports = router;
