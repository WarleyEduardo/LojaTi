/*
    Modulo 5  API LOJA
	Criando Rotas e Validação de Administração da Loja
*/

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Loja = mongoose.model('Loja');

//  Modulo 6 -  Api validações   -  Atualizando a validação para o controller da loja

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const LojaValidation = {
	show: { params: { id: Joi.string().alphanum().length(24).required() } },

	store: {
		body: {
			nome: Joi.string().required(),
			cnpj: Joi.string().length(18).required(),
			email: Joi.string().email().required(),
			telefones: Joi.array().items(Joi.string()).required(),
			endereco: Joi.object({
				local: Joi.string().required(),
				numero: Joi.string().required(),
				complemento: Joi.string().optional(),
				bairro: Joi.string().required(),
				cidade: Joi.string().required(),
				CEP: Joi.string().required(),
			}).required(),
		},
	},

	update: {
		body: {
			nome: Joi.string().optional(),
			cnpj: Joi.string().length(18).optional(),
			email: Joi.string().email().optional(),
			telefones: Joi.array().items(Joi.string()).optional(),
			endereco: Joi.object({
				local: Joi.string().required(),
				numero: Joi.string().required(),
				complemento: Joi.string().required(),
				bairro: Joi.string().required(),
				cidade: Joi.string().required(),
				CEP: Joi.string().required(),
			}).optional(),
		},
	},

	admin: (req, res, next) => {
		//  se não tem usuario registrado retorna sem autorização.
		if (!req.payload.id) return res.sendStatus(401);

		//pegar o id da loja  ex.: ?loja=i1mdilm
		const { loja } = req.query;

		//poderia pegar a loja pelo proprio id  , entender isso meelhor depois
		//const loja = req.params.id;

		//se não tiver loja retorna sem autorizaçao
		if (!loja) return res.sendStatus(401);

		Usuario.findById(req.payload.id)
			.then((usuario) => {
				//se não existir o usuario retorna sem autorização
				if (!usuario) return res.sendStatus(401);

				// se o usuario não tiver loja cadastrada retorna sem autorização
				if (!usuario.loja) return res.sendStatus(401);

				// se o usuario nao for administrador retorna sem autorização
				if (!usuario.permissao.includes('admin'))
					return res.sendStatus(401);

				// se a loja do no usuario for diferente da loja informada então retorna sem autorização
				if (usuario.loja.toString() !== loja)
					return res.sendStatus(401);

				//passando por todas as requisições acima, então o usuario e loja estao validos
				next();
			})
			.catch(next);
	},
};

module.exports = { LojaValidation };

/*
module.exports = (req, res, next) => {
	//  se não tem usuario registrado retorna sem autorização.
	if (!req.payload.id) return res.sendStatus(401);

	//pegar o id da loja  ex.: ?loja=i1mdilm
	const { loja } = req.query;

	//poderia pegar a loja pelo proprio id  , entender isso meelhor depois
	//const loja = req.params.id;

	//se não tiver loja retorna sem autorizaçao
	if (!loja) return res.sendStatus(401);

	Usuario.findById(req.payload.id)
		.then((usuario) => {
			//se não existir o usuario retorna sem autorização 
			if (!usuario) return res.sendStatus(401);

			// se o usuario não tiver loja cadastrada retorna sem autorização 
			if (!usuario.loja) return res.sendStatus(401);

			// se o usuario nao for administrador retorna sem autorização
			if (!usuario.permissao.includes('admin'))
				return res.sendStatus(401);

			// se a loja do no usuario for diferente da loja informada então retorna sem autorização 
			if (usuario.loja.toString() !== loja) return res.sendStatus(401);

			//passando por todas as requisições acima, então o usuario e loja estao validos 
			next();
		})
		.catch(next);

	};
    */
