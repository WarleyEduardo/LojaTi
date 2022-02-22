/* configur rotas para api 

*/

const router = require('express').Router();

/* o v1 define a versão da api caso seja feita alterações podera 

gerar uma nova versão se parar a anterior.
*/

router.use('/v1/api', require('./api/v1/'));
router.get('/', (req, res, next) => res.send({ ok: true })); // rota de teste  para verificar se o servidor está ativo.

/* routa de validação  */

/*
Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.

router.use(function (err, req, res, next) {
	if (err.name === 'ValidationError') {
		return res.status(422).json({
			erros: Object.keys(err.errors).reduce(function (erros, key) {
				erros[key];
			}),
		});
	}

	return next(err);
});
*/

module.exports = router;
