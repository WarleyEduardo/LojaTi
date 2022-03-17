// Modulo 9 -  Api  produtos - Criando controller  para administradores.
const mongoose = requere('mongoose');
const Produto = mongoose.model('produto');
const Categoria = mongoose.model('categoria');

class ProdutoController {
	// ADMIN
	// POST / store

	async store(req, res, next) {
		const {
			titulo,
			descricao,
			categoria: categoriaId,
			preco,
			promocao,
			sku,
		} = req.body;

		const { loja } = req.query;

		try {
			const produto = new Produto({
				titulo,
				disponibilidade: true,
				descricao,
				categoria: categoriaId,
				preco,
				promocao,
				sku,
				loja,
			});

			const categoria = await Categoria.findbyId(categoriaId);

			categoria.produtos.push(produto.id);

			await produto.save();
			await categoria.save();

			return res.send({ produto });
		} catch (e) {
			next(e);
		}
	}

	// put/:id

	async update(req, res, next) {
		try {
			const {
				titulo,
				descricao,
				disponibilidade,
				categoria,
				preco,
				promocao,
				sku,
			} = req.body;

			const { loja } = req.query;

			const produto = await Produto.findById(req.params.id);

			if (!produto)
				return res
					.status(400)
					.send({ error: 'Produto não encontrado' });

			if (titulo) produto.titulo = titulo;
			if (descricao) produto.descricao = descricao;
			if (disponibilidade !== undefined)
				produto.disponibilidade = disponibilidade;
			if (preco) produto.preco = preco;
			if (promocao) produto.promocao = promocao;
			if (sku) produto.sku = sku;

			if (
				categoria &&
				categoria.toString() !== produto.categoria.toString()
			) {
				const oldCategoria = await Categoria.findById(
					produto.categoria
				);
				const newCategoria = await Categoria.findById(categoria);

				/*   **** retirei a duplicação de codigo.

				if (oldCategoria && newCategoria) {
					oldCategoria.produtos = oldCategoria.filter(
						(item) => item !== produto._id
					);

					newCategoria.produtos.push(produto._id);
					produto.categoria = categoria;

					await oldCategoria.save();
					await newCategoria.save();
				} else if (newCategoria) {
					newCategoria.produtos.push(produto._id);
					produto.categoria = categoria;
					await newCategoria.save();
				}*/

				if (oldCategoria) {
					oldCategoria.produtos = oldCategoria.filter(
						(item) => item !== produto._id
					);

					await oldCategoria.save();
				}

				if (newCategoria) {
					newCategoria.produtos.push(produto._id);
					produto.categoria = categoria;

					await newCategoria.save();
				}
			}

			await produto.save();

			return res.send({ produto });
		} catch (e) {
			next(e);
		}
	}

	// put images/:id

	async updateImages(req, res, next) {
		try {
			const { loja } = req.query;

			const produto = await Produto.findOne({ _id: req.params.id, loja });

			if (!produto)
				return res
					.status(400)
					.send({ error: 'Produto não encontrado' });

			const novasImagens = req.files.map((item) => item.filename);

			produto.fotos = produtos.fotos
				.filter((item) => item)
				.concat(novasImagens);

			await produto.save();
			return res.send({ produto });
		} catch (e) {
			next(e);
		}
	}

	// DELETE  :/id - remove

	async remove(req, res, next) {
		const { loja } = req.query;

		try {
			const produto = await Produto.findOne({
				_id: req.params.id,
				loja,
			});

			if (!produto)
				return res
					.status(400)
					.send({ error: 'Produto não encontrado' });

			const categoria = await Categoria.findById(produto.categoria);
			if (!categoria) {
				categoria.produtos = categoria.produtos.filter(
					(item) => item !== produto._id
				);

				await categoria.save();
			}
		} catch (e) {
			next(e);
		}
	}
}

module.exports = ProdutoController;
