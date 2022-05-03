/*
   Modulo 16 -  api pagamentos -  criando rotas para pagamentos.

*/

const router = require('express').Router();
const PagamentoController = require('../../../controllers/Pagamentocontroller');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

/*
    Modulo 16  - api pagamentos  - Criando Validações  para pagamento
	e atualizando validações no controller de pedidos.  
*/

const {
	PagamentoValidation,
} = require('../../../controllers/validacoes/pagamentoValidation');

const Validation = require('express-validation');

const auth = require('../../auth');

const pagamentoController = new PagamentoController();

// TESTE

if (process.env.NODE_ENV !== 'production') {
	router.get('/tokens', (req, res) => res.render('pagseguro/index'));
}

// pagseguro

router.post('/notificao', pagamentoController.verNotificacao);
router.get('/session', pagamentoController.getSessionId);

// cliente

router.get(
	'/:id',
	auth.required,
	Validation(PagamentoValidation.show),
	pagamentoController.show
);

router.post(
	'/pagar/:id',
	auth.required,
	Validation(PagamentoValidation.pagar),
	pagamentoController.pagar
);

// admin
router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(PagamentoValidation.update),
	pagamentoController.update
);

module.exports = router;
