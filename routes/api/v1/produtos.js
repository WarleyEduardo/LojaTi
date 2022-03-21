// Modulo 9 - Api produtos - Criando rotas

const router = require('express').Router();
const ProdutoController = require('../../../controllers/ProdutoController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

Validation = require('express-validation'); // Modulo 9  - Api produtos - Criando validações

const {
	ProdutoValidation,
} = require('../../../controllers/validacoes/produtoValidation'); // Modulo 9  - Api produtos - Criando validações

const auth = require('../../auth');
const upload = require('../../../config/multer');
const { route } = require('./usuarios');

const produtoControler = new ProdutoController();

// ****  Rotas do ADMIN

// Post - criar um produto
router.post(
	'/',
	auth.required,
	LojaValidation.admin,
	Validation(ProdutoValidation.store), // Modulo 9  - Api produtos - Criando validações
	produtoControler.store
);
// put  -  alterar um produto

router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(ProdutoValidation.update), // Modulo 9  - Api produtos - Criando validações
	produtoControler.update
);

// put adicionar 4 fotos

router.put(
	'/images/:id',
	auth.required,
	LojaValidation.admin,
	Validation(ProdutoValidation.updateImages), // Modulo 9  - Api produtos - Criando validações
	upload.array('files', 4),
	produtoControler.updateImages
);

// delete - remover produto

router.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(ProdutoValidation.remove), // Modulo 9  - Api produtos - Criando validações
	produtoControler.remove
);

//**** Rotas do CLIENTE/VISITANTES

// get - retornar todos os produtos
router.get(
	'/',
	Validation(ProdutoValidation.index), // Modulo 9  - Api produtos - Criando validações
	produtoControler.index
);

// get- retornar todos os produtos disponiveis
router.get(
	'/disponiveis',
	Validation(ProdutoValidation.indexDisponiveis), // Modulo 9  - Api produtos - Criando validações
	produtoControler.indexDisponiveis
);

// get - localizar por nome
router.get(
	'/search/:search',
	Validation(ProdutoValidation.search), // Modulo 9  - Api produtos - Criando validações
	produtoControler.search
);

// get para retornar um produto específico.

router.get(
	'/:id',
	Validation(ProdutoValidation.show), // Modulo 9  - Api produtos - Criando validações
	produtoControler.show
);

// ***** Rotas de VARIAÇOES

// ***** rotas de AVALIAÇÕES

module.exports = router;
