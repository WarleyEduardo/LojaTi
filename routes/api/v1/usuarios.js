const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');

const usuarioController = new UsuarioController();

// inserção
router.post('/login', usuarioController.login); // testado
router.post('/registrar', usuarioController.store); // testado

// alteração
router.put('/', auth.required, usuarioController.update); // testado

// deleção
router.delete('/', auth.required, usuarioController.remove); // testado

// recuperar senha.

// esqueceu a senha
router.get('/recuperar-senha', usuarioController.showRecovery); // testado

//enviar o e-mail para ser recuperado
router.post('/recuperar-senha', usuarioController.createRecovery); // testado

// informar nova senha
router.get('/senha-recuperada', usuarioController.showCompleteRecovery); // testado

// gravar a nova senha no servidor.
router.post('/senha-recuperada', usuarioController.completeRecovery); // testado

// buscar
router.get('/', auth.required, usuarioController.index); // testado
router.get('/:id', auth.required, usuarioController.show); // testado

module.exports = router;
