/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Loja = mongoose.model('Loja');

module.exports = (req, res, next) => {
	/*  se não tem usuario registrado retorna sem autorização.*/
	if (!req.payload.id) return res.sendStatus(401);

	/*pegar o id da loja  ex.: ?loja=i1mdilm*/
	const { loja } = req.query;

	/*se não tiver loja retorna sem autorizaçao*/
	if (!loja) return res.sendStatus(401);

	Usuario.findById(req.payload.id)
		.then((usuario) => {
			/*se não existir o usuario retorna sem autorização */
			if (!usuario) return res.sendStatus(401);

			/* se o usuario não tiver loja cadastrada retorna sem autorização */
			if (!usuario.loja) return res.sendStatus(401);

			/* se o usuario nao for administrador retorna sem autorização*/
			if (!usuario.permissao.includes('admin'))
				return res.sendStatus(401);

			/* se a loja do no usuario for diferente da loja informada então retorna sem autorização */
			if (usuario.loja.toString() !== loja) return res.sendStatus(401);

			/* passando por todas as requisições acima, então o usuario e loja estao validos */
			next();
		})
		.catch(next);
};
