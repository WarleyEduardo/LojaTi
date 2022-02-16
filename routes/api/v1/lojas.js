/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/

const router = require('express').Router();
const lojaValidation = require('../../../controllers/validacoes/lojaValidation');
const auth = require('../../auth');
const LojaController = require('../../../controllers/LojaController');

const lojaController = new LojaController();

// busca
router.get('/', lojaController.index);
router.get('/:id', lojaController.show);

// inserção
router.post('/', auth.required, lojaController.store);

// alteração
router.put('/:id', auth.required, lojaValidation, lojaController.update);

// deleção
router.delete('/:id', auth.required, lojaValidation, lojaController.remove);

module.exports = router;
