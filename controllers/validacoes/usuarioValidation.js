/*
  Modulo 6 - Api Validações 
  Preparando e fazendo Setup da validação.
*/

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const UsuarioValidation = {
	// Modulo 6 -  Api Validações - atualizando as validações no usuario.
	store: {
		body: {
			nome: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			loja: Joi.string().alphanum().length(24).required(),
		},
	},

	// Modulo 6 -  Api Validações - atualizando as validações no usuario.
	update: {
		body: {
			nome: Joi.string().optional(),
			email: Joi.string().email().optional(),
			password: Joi.string().optional(),
		},
	},

	// Modulo 6 -  Api Validações - atualizando as validações no usuario.
	show: {
		params: { id: Joi.string().alphanum().length(24).required() },
	},

	//  Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.
	login: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		},
	},
};

module.exports = { UsuarioValidation };
