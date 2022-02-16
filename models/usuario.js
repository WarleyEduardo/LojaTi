const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const uniqueValitador = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UsuarioSchema = new mongoose.Schema(
	{
		nome: {
			type: String,
			required: [true, 'não pode ficar vazio.'],
		},

		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, 'não pode ficar vazio.'],
			index: true,
			match: [/\S+@\S+\.\S+/, 'é inválido'],
		},

		loja: {
			type: Schema.Types.ObjectId,
			ref: 'loja',
			required: [true, 'não pode ficar vazia.'],
		},

		permissao: {
			type: Array,
			default: ['cliente'],
		},

		hash: String,
		salt: String,
		recovery: {
			type: {
				token: String,
				date: Date,
			},

			default: {},
		},
	},
	{ timestamps: true }
);

UsuarioSchema.plugin(uniqueValitador, { message: 'já está sendo utilizado' });

// criando a senha de usuario
UsuarioSchema.methods.setSenha = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
};

// validando se senha é a mesma do usuario

UsuarioSchema.methods.validarSenha = function (password) {
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');

	return hash === this.hash;
};

// gerar o token

UsuarioSchema.methods.gerarToken = function () {
	const hoje = new Date();
	const exp = new Date(hoje);
	exp.setDate(hoje.getDate() + 15);

	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			nome: this.nome,
			exp: parseFloat(exp.getTime() / 1000, 10),
		},
		secret
	);
};

// enviar o token
UsuarioSchema.methods.enviarAuthJSON = function () {
	return {
		//_id: this._id,
		nome: this.nome,
		email: this.email,
		loja: this.loja,
		role: this.permissao,
		token: this.gerarToken(),
	};
};

// recuperaçaõ de setSenha

UsuarioSchema.methods.criarTokenRecuperacaoSenha = function () {
	this.recovery = {};
	this.recovery.token = crypto.randomBytes(16).toString('hex');
	this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	return this.recovery;
};

// limpar dados de recuperaçaõ de setSenha
UsuarioSchema.methods.finalizarTokenRecuperacaoSenha = function () {
	this.recovery = { token: null, date: null };
	return this.recovery;
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
