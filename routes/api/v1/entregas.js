// Módulo 14 -  api entrega - criando  rotas  para módulo de entrega
const router = require('express').Router();
const EntregaController = require('../../../controllers/EntregaController');
const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

// Módulo 14 -  api entrega - criando  validações com joi

const Validation = require('express-validation');
const {
	EntregaValidation,
} = require('../../../controllers/validacoes/entregaValidation');

const auth = require('../../auth');

const entregaController = new EntregaController();

router.get(
	'/:id',
	auth.required,

	Validation(EntregaValidation.show), // Módulo 14 -  api entrega - criando  validações com joi
	entregaController.show
);

router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(EntregaValidation.update), // Módulo 14 -  api entrega - criando  validações com joi
	entregaController.update
);
router.post(
	'/calcular',
	Validation(EntregaValidation.calcular), // Módulo 14 -  api entrega - criando  validações com joi

	entregaController.calcular
);

module.exports = router;
