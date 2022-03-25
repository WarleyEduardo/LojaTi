//Modulo  10 - Api  avaliações - criando rotas.

const router = require('express').Router();
const AvalicaoController = require('../../../controllers/AvaliacaoController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');
const auth = require('../../auth');

// Modulo 10 -  Api avaliações - fazendo as validações com joi.
const {
	AvaliacaoValidation,
} = require('../../../controllers/validacoes/avaliacaoValidation');

const Validation = require('express-validation');

const avaliacaoController = new AvalicaoController();

// CLIENTES/VISITANTES

// Get  - index
router.get(
	'/',
	Validation(AvaliacaoValidation.index), // Modulo 10 -  Api avaliações - fazendo as validações com joi.
	avaliacaoController.index
);
router.get(
	'/:id',
	Validation(AvaliacaoValidation.show), // Modulo 10 -  Api avaliações - fazendo as validações com joi.
	avaliacaoController.show
);
router.post(
	'/',
	auth.required,
	Validation(AvaliacaoValidation.store), // Modulo 10 -  Api avaliações - fazendo as validações com joi.
	avaliacaoController.store
);

// ADMINISTRADOR

router.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(AvaliacaoValidation.remove), // Modulo 10 -  Api avaliações - fazendo as validações com joi.
	avaliacaoController.remove
);

module.exports = router;
