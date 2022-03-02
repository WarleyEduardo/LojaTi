// Modulo 7 -  Api clientes  - criando metodos do controller para administradores.

const { number } = require('joi');
const mongoose = require('mongoose');
const Cliente = mongoose.model('Cliente');
const Usuario = mongoose.model('Usuario');

class ClienteController {
	// get / index
	// retorna todos os clientes de uma determinada loja

	async index(req, res, next) {
		try {
			// gerenciar paginação
			const offset = Number(req.query.offset) || 0;
			const limit = Number(req.query.limit) || 30;
			const clientes = await Cliente.paginate(
				{ loja: req.query.loja },
				{ offset, limit, populate: 'usuario' }
			);

			return res.send({ clientes });
		} catch (e) {
			next(e);
		}
	}

	// Get / search/:search/pedidos

	searchPedidos(req, res, next) {
		return res.status(400).send({ error: 'Em Desenvolvimento' });
	}

	// get /admin/:id/pedidos
	searchPedidosCliente(req, res, next) {
		return res.status(400).send({ error: 'Em Desenvolvimento' });
	}

	// get / search/:search
	async search(req, res, next) {
		// gerenciar paginação
		const offset = Number(req.query.offset) || 0;
		const limit = Number(req.query.limit) || 30;
		const search = new RegExp(req.params.search, 'i');
		try {
			const clientes = await Cliente.paginate(
				{ loja: req.query.loja, nome: { $regex: search } },
				{ offset, limit, populate: 'usuario' }
			);

			return res.send({ clientes });
		} catch (e) {
			next(e);
		}
	}

	// get /admin/:id

	async showAdmin(req, res, next) {
		try {
			const cliente = await (
				await Cliente.findOne({
					_id: req.params.id,
					loja: req.query.loja,
				})
			).populate('usuario');
			return res.send({ cliente });
		} catch (e) {
			next(e);
		}
	}

	// put /admin/:id

	async updateAdmin(req, res, next) {
		const { nome, cfp, email, telefones, endereco, dataDeNascimento } =
			req.body;

		try {
			// no exemplo const cliente é maiusculo : const Cliente
			const cliente = await (
				await Cliente.findById(req.params.id)
			).populate('usuario');

			if (nome) {
				(cliente.usuario.nome = nome), (cliente.nome = nome);
			}

			if (email) cliente.usuario.email = email;
			if (telefones) cliente.telefones = telefones;
			if (endereco) cliente.endereco = endereco;
			if (dataDeNascimento) cliente.dataDeNascimento = dataDeNascimento;
			await cliente.save();
			return res.send({ cliente });
		} catch (e) {
			next(e);
		}
	}

	/*
 Cliente
  Modulo 7 -  API  Clientes - Criando metodos do controller  para cliente.
*/

	// Get /cliente/:id
	async show(req, res, next) {
		try {
			const cliente = await Cliente.findOne({
				usuario: req.payload.id,
				loja: req.query.loja,
			}).populate('usuario');
			return res.send({ cliente });
		} catch (e) {
			next(e);
		}
	}

	// post /cliente

	async store(req, res, next) {
		const {
			nome,
			email,
			cpf,
			telefones,
			endereco,
			dataDeNascimento,
			password,
		} = req.body;
		const { loja } = req.query.loja;

		const usuario = new Usuario({ nome, email, loja });
		usuario.setSenha(password);

		const cliente = new Cliente({
			nome,
			cpf,
			telefones,
			endereco,
			loja,
			dataDeNascimento,
			usuario: usuario._id,
		});

		try {
			await usuario.save();
			await cliente.save();
		} catch (e) {
			next(e);
		}

		// o uso do cliente._doc é porque esta utilizando o paginate. e será colocado o retorno do cliente dentro do doc.
		return res.send({
			cliente: Object.assign({}, cliente._doc, { email: usuario.email }),
		});
	}

	// update /cliente/:id

	async update(req, res, next) {
		const {
			nome,
			email,
			cpf,
			telefones,
			endereco,
			dataDeNascimento,
			password,
		} = req.body;

		try {
			const cliente = await (
				await Cliente.findById(req.payload.id)
			).populate('usuario');

			if (nome) {
				cliente.usuario.nome = nome;
				cliente.nome = nome;
			}

			if (email) cliente.usuario.email = email;
			if (password) cliente.usuario.setSenha(password);
			if (cpf) cliente.cpf = cpf;
			if (telefones) cliente.telefones = telefones;
			if (endereco) cliente.endereco;
			if (dataDeNascimento) cliente.dataDeNascimento;

			await cliente.save();
			return res.send({ cliente });
		} catch (e) {
			next(e);
		}
	}

	/* somente é excluído o usuario , o cliente fica apenas marcado como deletado para 
      consultar os pedidos feitos antes de cancelar.
	*/
	async remove(req, res, next) {
		try {
			const cliente = await (
				await Cliente.findOne({ usuario: req.payload.id })
			).populate('usuario');

			await cliente.usuario.remove();
			cliente.deletado = true;
			await cliente.save();
			return res.send({ deletado: true });
		} catch (e) {
			next(e);
		}
	}
}

module.exports = ClienteController;