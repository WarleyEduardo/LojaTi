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

//Modulo  10 - Api  avaliações - criando rotas.
router.use('/avaliacoes', require('./avaliacoes'));

// Módulo 11 -  Api variações - criando e preparando as rotas.
router.use('/variacoes', require('./variacoes'));

//Modulo 12 - Api pedidos -  criando as rotas para pedidos.
router.use('/pedidos', require('./pedidos'));

// Módulo 14 -  api entrega - criando  rotas  para módulo de entrega
router.use('/entregas', require('./entregas'));

//  Modulo 16 -  api pagamentos -  criando rotas para pagamentos.
router.use('/pagamentos', require('./pagamentos'));

module.exports = router;
