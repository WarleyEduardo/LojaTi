const router = require('express').Router();
const CategoriaController = require('../../../controllers/CategoriaController');
const auth = require('../../auth');
const Validation = require('express-validation');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

const {
	CategoriaValidation,
} = require('../../../controllers/validacoes/categoriaValidation');

const categoriaController = new CategoriaController();

// get /
//router.get('/', categoriaController.index); Modulo 8 - Api categoria  criando validações
router.get(
	'/',
	Validation(CategoriaValidation.index),
	categoriaController.index
);

// get/disponiveis
//router.get('/disponiveis', categoriaController.indexDisponiveis); Modulo 8 - Api categoria  criando validações
router.get(
	'/disponiveis',
	Validation(CategoriaValidation.indexDisponiveis),
	categoriaController.indexDisponiveis
);

// get/:id
// router.get('/:id', categoriaController.show); Modulo 8 - Api categoria  criando validações

router.get(
	'/:id',
	Validation(CategoriaValidation.show),
	categoriaController.show
);

// post  - criar uma nova categoria ( precisa estar logado e ser administrador)
router.post(
	'/',
	auth.required,
	LojaValidation.admin,
	Validation(CategoriaValidation.store), // Modulo 8 - Api categoria  criando validações
	categoriaController.store
);

// put  - alterar uma  categoria ( precisa estar logado e ser administrador)
router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(CategoriaValidation.update), // Modulo 8 - Api categoria  criando validações
	categoriaController.update
);

// delete  - remover  categoria( precisa estar logado e ser administrador)
router.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(CategoriaValidation.remove), // Modulo 8 - Api categoria  criando validações
	categoriaController.remove
);

// Modulo 9 - api produtos -  fazendo as atualizações de produtos em categoria
// Rotas de produtos

router.get('/:id/produtos', categoriaController.showProdutos); // testado
router.put(
	'/:id/produtos',
	auth.required,
	LojaValidation.admin,
	categoriaController.updateProdutos
); // testado

module.exports = router;
