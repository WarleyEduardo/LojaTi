//Modulo  10 - Api  avaliações - criando rotas.

const router = require('express').Router();
const AvalicaoController = require('../../../controllers/AvaliacaoController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');
const auth = require('../../auth');

const avaliacaoController = new AvalicaoController();

// CLIENTES/VISITANTES

// Get  - index
router.get('/', avaliacaoController.index);
router.get('/:id', avaliacaoController.show);
router.post('/', auth.required, avaliacaoController.store);

// ADMINISTRADOR

router.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	avaliacaoController.remove
);

module.exports = router;
