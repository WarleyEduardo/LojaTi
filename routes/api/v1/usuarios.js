const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');

// Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.
const Validation = require('express-validation');

const {
	UsuarioValidation,
} = require('../../../controllers/validacoes/usuarioValidation');

//  Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.

const usuarioController = new UsuarioController();

// Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.
//router.post('/login', usuarioController.login); // testado

router.post(
	'/login',
	Validation(UsuarioValidation.login),
	usuarioController.login
); // testado


router.post(
	'/login/admin',
	Validation(UsuarioValidation.login),
	usuarioController.loginAdmin
); 

// Modulo 6 - Api Validações  - atualizando as validações no usuario.
//router.post('/registrar', usuarioController.store); // testado
// inserção
router.post(
	'/registrar',
	Validation(UsuarioValidation.store),
	usuarioController.store
);

// Modulo 6 - Api Validações  - atualizando as validações no usuario.
//router.put('/', auth.required, usuarioController.update); // testado
// alteração
router.put(
	'/',
	auth.required,
	Validation(UsuarioValidation.update),
	usuarioController.update
);

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

// Modulo 6 - Api Validações  - atualizando as validações no usuario.
//router.get('/:id', auth.required, usuarioController.show); // testado
router.get(
	'/:id',
	auth.required,
	Validation(UsuarioValidation.show),
	usuarioController.show
);

module.exports = router;
