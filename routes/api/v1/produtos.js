// Modulo 9 - Api produtos - Criando rotas

const router = require('express').Router();
const ProdutoController = require('../../../controllers/ProdutoController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

const auth = require('../../auth');
const upload = require('../../../config/multer');
const { route } = require('./usuarios');

const produtoControler = new ProdutoController();

// ****  Rotas do ADMIN

// Post - criar um produto
router.post('/', auth.required, LojaValidation.admin, produtoControler.store);
// put  -  alterar um produto

router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	produtoControler.update
);

// put adicionar 4 fotos

router.put(
	'/images/:id',
	auth.required,
	LojaValidation.admin,
	upload.array('files', 4),
	produtoControler.updateImages
);

// delete - remover produto

route.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	produtoControler.remove
);

//**** Rotas do CLIENTE/VISITANTES

// get - retornar todos os produtos
route.get('/', produtoControler.index);

// get- retornar todos os produtos disponiveis
route.get('/disponiveis', produtoControler.indexDisponiveis);

// get - localizar por nome
route.get('/search/:search', produtoControler.search);

// get para retornar um produto específico.

route.get('/:id', produtoControler.show);

// ***** Rotas de VARIAÇOES

// ***** rotas de AVALIAÇÕES

module.exports = router;
