//  Modulo 7 -  Api Clientes  - Criando rotas para clientes
const router = require('express').Router();
const ClienteController = require('../../../controllers/ClienteController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

const {
	ClienteValidation,
} = require('../../../controllers/validacoes/clienteValidation');

const Validation = require('express-validation');
const auth = require('../../auth');

const clienteController = new ClienteController();

// ***********  ADMIN =  o que o admin pode fazer ********************

// buscar todos os clientes.
router.get('/', auth.required, LojaValidation.admin, ClienteController.index);

// buscar os pedidos.
/*
 será criada quando estiver no modulo de pedidos
router.get(
	'/search/:search/pedidos',
	auth.required,
	LojaValidation.admin,
	clienteController.searchPedidos
);
*/

// buscar os clientes por nome

router.get(
	'/search/:search',
	auth.required,
	LojaValidation.admin,
	clienteController.search
);

// visualizar os dados do Administração

router.get(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	clienteController.showAdmin
);

// buscar todos os pedidos de um determinado cliente.

/* será criada quando estiver no modulo de pedidos
router.get(
	'/admin/:id/pedidos',
	auth.required,
	LojaValidation.admin,
	clienteController.showPedidosCliente
);
*/
// atualizar os dados do cliente

router.put(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	clienteController.updateAdmin
);

//  *********  CLIENTE = o que o cliente pode fazer *****************

// ver os dados do cliente
router.get('/:id', auth.required, clienteController.show);

// criar o cliente
router.post('/', clienteController.store);

// alterar os dados do cliente
router.put('/:id', auth.required, clienteController.update);

// remover o cliente
router.delete('/:id', auth.required, clienteController.remove);

module.exports = router;
