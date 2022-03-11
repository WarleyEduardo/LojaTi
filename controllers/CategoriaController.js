// Modulo 8 -  Api Categoria -  Criando controller.

const moongose = require('mongoose');
const Categoria = moongose.model('Categoria');

class CategoriaController {
	// get / index
	index(req, res, next) {
		Categoria.find({ loja: req.query.loja })
			.select('_id produtos nome codigo loja')
			.then((categorias) => res.send({ categorias }))
			.catch(next);
	}

	// get/disponiveis

	indexDisponiveis(req, res, next) {
		Categoria.find({ loja: req.query.loja, disponibilidade: true })
			.select('_id produtos nome codigo loja')
			.then((categorias) => {
				res.send({ categorias });
			})
			.catch(next);
	}

	// /:id  show

	show(req, res, next) {
		Categoria.findOne({ loja: req.query.loja, _id: req.params.id })
			.select('_id , produtos nome codigo loja')
			.populate(['produtos'])
			.then((categoria) => res.send({ categoria }))
			.catch(next);
	}

	// post / store

	store(req, res, next) {
		const { nome, codigo } = req.body;
		const { loja } = req.query;

		const categoria = new Categoria({
			nome,
			codigo,
			loja,
			disponibilidade: true,
		});

		categoria
			.save()
			.then(() => res.send({ categoria }))
			.catch(next);
	}
	// update /:id
	async update(req, res, next) {
		const { nome, codigo, disponibilidade, produtos } = req.body;
		try {
			const categoria = await Categoria.findById(req.params.id);

			if (nome) categoria.nome = nome;
			if (codigo) categoria.codigo = codigo;
			if (disponibilidade !== undefined)
				categoria.disponibilidade = disponibilidade;
			if (produtos) categoria.produtos = produtos;

			await categoria.save();

			return res.send({ categoria });
		} catch (e) {
			next(e);
		}
	}

	//DELETE/:id

	async remove(req, res, next) {
		try {
			const categoria = await Categoria.findById(req.params.id);

			await categoria.remove();

			return res.send({ deletado: true });
		} catch (e) {
			next(e);
		}
	}

	//* produtos  */
}

module.exports = CategoriaController;
