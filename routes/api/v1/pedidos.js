//Modulo 12 - Api pedidos -  criando as rotas para pedidos.

const router = require('express').Router();
const PedidoController = require('../../../controllers/PedidoController');

const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');
const auth = require('../../auth');

// Modulo 12 -  api  pedidos  - Criando as validações para pedidos.

const {
	PedidoValidation,
} = require('../../../controllers/validacoes/pedidoValidation');

const Validation = require('express-validation');

const pedidoController = new PedidoController();

// -----Rotas do Admin.

router.get(
	'/admin',
	auth.required,
	LojaValidation.admin,
	Validation(PedidoValidation.indexAdmin),
	pedidoController.indexAdmin
);
router.get(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	Validation(PedidoValidation.showAdmin),
	pedidoController.showAdmin
);
router.delete(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	Validation(PedidoValidation.removeAdmin),
	pedidoController.removeAdmin
);

//-- carrinho

router.get(
	'/admin/:id/carrinho',
	auth.required,
	LojaValidation.admin,
	Validation(PedidoValidation.showCarrinhoPedidoAdmin),
	pedidoController.showCarrinhoPedidoAdmin
);

// entrega

// pagamento

//-------------------------------

//------  Rotas do CLIENTE

router.get('/', auth.required, pedidoController.index);
router.get('/:id', auth.required, pedidoController.show);
router.post('/', auth.required, pedidoController.store);
router.delete('/:id', auth.required, pedidoController.remove);

//-- carrinho

router.get('/:id/carrinho', auth.required, pedidoController.showCarrinhoPedido);
// -- entrega

//--------------------------

module.exports = router;
