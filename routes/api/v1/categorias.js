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
router.get('/', categoriaController.index);

// get/disponiveis
router.get('/disponiveis', categoriaController.indexDisponiveis);

// get/:id
router.get('/:id', categoriaController.show);

// post  - criar uma nova categoria ( precisa estar logado e ser administrador)
router.post(
	'/',
	auth.required,
	LojaValidation.admin,
	categoriaController.store
);

// put  - alterar uma  categoria ( precisa estar logado e ser administrador)
router.put(
	'/',
	auth.required,
	LojaValidation.admin,
	categoriaController.update
);

// delete  - remover  categoria( precisa estar logado e ser administrador)
router.delete(
	'/',
	auth.required,
	LojaValidation.admin,
	categoriaController.remove
);

module.exports = router;
