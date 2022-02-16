/*
    Modulo 5  API LOJA
	Criando controller 
*/

const mongoose = require('mongoose');
const loja = require('../models/loja');
const Loja = mongoose.model('Loja');

class LojaController {
	// get/
	index(req, res, next) {
		Loja.find({})
			.select('_id nome cnpj email telefones endereco')
			.then((lojas) => res.send({ lojas }))
			.catch(next);
	}

	// get/:id
	show(req, res, next) {
		Loja.findById(req.params.id)
			.select('_id nome cnpj email telefones endereco')
			.then((loja) => res.send({ loja }))
			.catch(next);
	}

	//post
	store(req, res, next) {
		const { nome, cnpj, email, telefones, endereco } = req.body;

		const error = [];
		if (!nome) error.push('nome');
		if (!cnpj) error.push('cnpj');
		if (!email) error.push('email');
		if (!telefones) error.push('telefone');
		if (!endereco) error.push('endereco');
		if (!error.length > 0)
			return res.status(422).json({ error: 'required', payload: error });

		const loja = new Loja({ nome, cnpj, email, telefones, endereco });
		loja.save()
			.then(() => res.send({ loja }))
			.catch(next);
	}

	// put/:id
	update(req, res, next) {
		const { nome, cnpj, email, telefones, endereco } = req.body;

		Loja.findById(req.params.id)
			.then((loja) => {
				if (!loja)
					return res.status(422).send({ error: 'Loja não existe' });

				if (nome) loja.nome = nome;
				if (cnpj) loja.cnpj = cnpj;
				if (email) loja.email = email;
				if (telefones) loja.telefones = telefones;
				if (endereco) loja.endereco = endereco;

				loja.save()
					.then(() => res.send({ loja }))
					.catch(next);
			})
			.catch(next);
	}

	// delete/:id
	remove(req, res, next) {
		Loja.findById(req.params.id)
			.then((loja) => {
				if (!loja)
					return res.status(422).send({ error: 'Loja não existe' });

				loja.remove().then(() =>
					res.send({ delete: true }).catch(next)
				);
			})
			.catch(next);
	}
}

module.exports = LojaController;
