// Módulo 14 -  api entrega - criando  validações com joi

const Joi = require('joi');
const EntregaValidation = {
	show: {
		params: {
			id: Joi.string().alphanum().length(24).required(),
		},

		query: { loja: Joi.string().alphanum().length(24).required() },
	},

	update: {
		params: {
			id: Joi.string().alphanum().length(24).required(),
		},

		query: { loja: Joi.string().alphanum().length(24).required() },

		body: {
			status: Joi.string().optional(),
			codigoRastreamento: Joi.string().optional(),
		},
	},
	calcular: {
		body: {
			cep: Joi.string().required(),
			carrinho: Joi.array()
				.items(
					Joi.object({
						produto: Joi.string().alphanum().length(24).required(),
						variacao: Joi.string().alphanum().length(24).required(),
						precoUnitario: Joi.number().optional(),
						quantidade: Joi.number().optional(),
					})
				)
				.required(),
		},
	},
};

module.exports = { EntregaValidation };
