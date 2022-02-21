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
router.get('/', lojaController.index); // testado modulo 5 - fazendo os teste manuais e testando
router.get('/:id', lojaController.show); // testado modulo 5 - fazendo os teste manuais e testando

// inserção
router.post('/', auth.required, lojaController.store); // testado modulo 5 - fazendo os teste manuais e testando

// alteração
router.put('/:id', auth.required, lojaValidation, lojaController.update); // testado modulo 5 - fazendo os teste manuais e testando

// deleção
router.delete('/:id', auth.required, lojaValidation, lojaController.remove); // testado modulo 5 - fazendo os teste manuais e testando

module.exports = router;
