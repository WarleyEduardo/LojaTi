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
//router.get('/', auth.required, LojaValidation.admin, ClienteController.index);
// Modulo 7 - Api Clientes  -  Validações
router.get(
	'/',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.index),
	clienteController.index
);

// buscar os pedidos.

//Modulo 12 - Api pedidos -  criando as rotas para pedidos.
router.get(
	'/search/:search/pedidos',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.searchPedidos), // Modulo 12 -  api  pedidos  - Criando as validações para pedidos.
	clienteController.searchPedidos
);

// buscar os clientes por nome
// router.get('/search/:search',auth.required,LojaValidation.admin,	clienteController.search);

// Modulo 7 - Api Clientes  -  Validações
router.get(
	'/search/:search',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.search),
	clienteController.search
);

// visualizar os dados do Administração

//router.get('/admin/:id',auth.required,LojaValidation.admin,clienteController.showAdmin);
// Modulo 7 - Api Clientes  -  Validações
router.get(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.showAdmin),
	clienteController.showAdmin
);

// buscar todos os pedidos de um determinado cliente.

//Modulo 12 - Api pedidos -  criando as rotas para pedidos.
router.get(
	'/admin/:id/pedidos',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.showPedidosCliente), // Modulo 12 -  api  pedidos  - Criando as validações para pedidos.
	clienteController.showPedidosCliente
);

// atualizar os dados do cliente
// router.put('/admin/:id',auth.required,LojaValidation.admin,clienteController.updateAdmin);

// Modulo 7 - Api Clientes  -  Validações
router.put(
	'/admin/:id',
	auth.required,
	LojaValidation.admin,
	Validation(ClienteValidation.updateAdmin),
	clienteController.updateAdmin
);

//  *********  CLIENTE = o que o cliente pode fazer *****************

// ver os dados do cliente
//router.get('/:id', auth.required, clienteController.show);
// Modulo 7 - Api Clientes  -  Validações
router.get(
	'/:id',
	auth.required,
	Validation(ClienteValidation.show),
	clienteController.show
);

// criar o cliente
//router.post('/', clienteController.store);

// Modulo 7 - Api Clientes  -  Validações
router.post('/', Validation(ClienteValidation.store), clienteController.store);

// alterar os dados do cliente
//router.put('/:id', auth.required, clienteController.update);

// Modulo 7 - Api Clientes  -  Validações
router.put(
	'/:id',
	auth.required,
	Validation(ClienteValidation.update),
	clienteController.update
);

// remover o cliente
router.delete('/:id', auth.required, clienteController.remove);

module.exports = router;
