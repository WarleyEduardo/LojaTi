/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/

const router = require('express').Router();
// Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja
//const lojaValidation = require('../../../controllers/validacoes/lojaValidation');

const {
	LojaValidation,
} = require('../../../controllers/validacoes/lojaValidation');

const Validation = require('express-validation');

const auth = require('../../auth');
const LojaController = require('../../../controllers/LojaController');

const lojaController = new LojaController();

// busca
router.get('/', lojaController.index); // testado modulo 5 - fazendo os teste manuais e testando
//router.get('/:id', lojaController.show); // testado modulo 5 - fazendo os teste manuais e testando
router.get('/:id', Validation(LojaValidation.show), lojaController.show); //Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja

// inserção
//router.post('/', auth.required, lojaController.store); // testado modulo 5 - fazendo os teste manuais e testando
router.post(
	'/',
	auth.required,
	Validation(LojaValidation.store),
	lojaController.store
); //  Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja

//  Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja
// alteração
//router.put('/:id', auth.required, lojaValidation, lojaController.update); // testado modulo 5 - fazendo os teste manuais e testando
router.put(
	'/:id',
	auth.required,
	LojaValidation.admin,
	Validation(LojaValidation.update),
	lojaController.update
);

//  Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja
// deleção
//router.delete('/:id', auth.required, lojaValidation, lojaController.remove); // testado modulo 5 - fazendo os teste manuais e testando
router.delete(
	'/:id',
	auth.required,
	LojaValidation.admin,
	lojaController.remove
);

module.exports = router;
