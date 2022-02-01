const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');

const usuarioController = new UsuarioController();

// inserção
router.post('/login', usuarioController.login);
router.post('/registrar', usuarioController.store); // testado

// alteração
router.put('/', auth.required, usuarioController.update);

// deleção
router.delete('/', auth.required, usuarioController.remove);

// recuperar senha.

// esqueceu a senha
router.get('/recuperar-senha', usuarioController.showRecovery);

//enviar o e-mail para ser recuperado
router.get('/recuperar-senha', usuarioController.createRecovery);

// informar nova senha
router.get('/senha-recuperada', usuarioController.showCompleteRecovery);

// gravar a nova senha no servidor.
router.post('/senha-recuperada', usuarioController.completeRecovery);

// buscar
router.get('/', auth.required, usuarioController.index);
router.get('/:id', auth.required, usuarioController.show);

module.exports = router;
