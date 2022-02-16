const router = require('express').Router();

router.use('/usuarios', require('./usuarios'));

/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/
router.use('/lojas', require('./lojas'));

module.exports = router;
