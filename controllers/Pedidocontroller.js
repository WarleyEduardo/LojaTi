// Modulo 12 -  Api pedidos - criando o controller para administradores.

const mongoose = require('mongoose');
const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');
const Cliente = mongoose.model('Cliente');

// Modulo 12 - api  pedidos -  atualizando  e corrigindo  as rotas e controller  de clientes em pedidos
const CarrinhoValidation = require('./validacoes/carrinhoValidation');

class PedidoController {
	//teste
	index(req, res, next) {
		console.log('teste');
	}

	//-  Rotas de administradores

	// get 	/admin  indexAdmin

	async indexAdmin(req, res, next) {
		const { offset, limit, loja } = req.query;

		try {
			const pedidos = await Pedido.paginate(
				{ loja },
				{
					offset: Number(offset || 0),
					limit: Number(limit || 30),
					populte: ['cliente,pagamento,entrega'],
				}
			);

			pedidos.docs = await Promise.all(
				pedidos.docs.map(async (pedido) => {
					pedido.carrinho = await Promise.all(
						pedido.carrinho.map(async (item) => {
							item.produto = await Produto.findById(item.produto);
							item.variacao = await Variacao.findById(
								item.variacao
							);
							return item;
						})
					);

					return pedido;
				})
			);

			res.send({ pedidos });
		} catch (e) {
			next(e);
		}
	}

	//  get /admin/:id showAdmin

	async showAdmin(req, res, next) {
		try {
			const pedido = await Pedido.findOne({
				loja: req.query.loja,
				_id: req.params.id,
			}).populate(['cliente', 'pagamento', 'entrega']);

			pedido.carrinho = await Promise.all(
				pedido.carrinho.map(async (item) => {
					(item.produto = await Produto.findById(item.produto)),
						(item.variacao = await Produto.findById(item.Variacao));
					return item;
				})
			);

			return res.send({ pedido });
		} catch (e) {
			next(e);
		}
	}

	//  delete /admin/:id  removeAdmin

	async removeAdmin(req, res, next) {
		try {
			const pedido = await Pedido.findOne({
				loja: req.query.loja,
				_id: req.params.id,
			});

			if (!pedido)
				return res.status(400).send({ error: 'Pedido não encontrado' });

			pedido.cancelado = true;

			// Registro de atividade = pedido : canceladado.
			// enviar email para cliente = pedido cancelado.

			await pedido.save();

			return res.send({ cancelado: true });
		} catch (e) {
			next(e);
		}
	}

	// get /admin/:id/carrinho  showCarrinhoPedidoAdmin

	async showCarrinhoPedidoAdmin(req, res, next) {
		try {
			const pedido = await Pedido.findOne({
				loja: req.query.loja,
				_id: req.params.id,
			});
			pedido.carrinho = await Promise.all(
				pedido.carrinho.map(async (item) => {
					item.produto = await Produto.findById(item.produto);
					item.variacao = await Variacao.findById(item.variacao);
					return item;
				})
			);
			return res.send({ carrinho: pedido.carrinho });
		} catch (e) {
			next(e);
		}
	}

	//-----

	// -------- CLIENTES

	// GET / index

	async index(req, res, next) {
		const { offset, limit, loja } = req;

		try {
			const cliente = await Cliente.findById({ usuario: req.paylod.id });
			const pedidos = await Pedido.paginate(
				{ loja, cliente: cliente._id },
				{
					offset: Number(offset || 0),
					limit: Number(limit || 30),
					populate: ['cliente', 'pagamento', 'entrega'],
				}
			);

			pedidos.docs = await Promise.all(
				pedidos.docs.map(async (pedido) => {
					pedido.carrinho = await Promise.all(
						pedido.carrinho.map(async (item) => {
							item.produto = await Produto.findById(item.produto);
							item.variacao = await Variacao.findById(
								item.variacao
							);
							return item;
						})
					);
				})
			);

			return res.send({ pedidos });
		} catch (e) {
			next(e);
		}
	}

	// get /:id  - show

	async show(req, res, next) {
		try {
			const cliente = await Cliente.findById({ usuario: req.paylod.id });
			const pedido = await Pedido.findOne({
				cliente: cliente._id,
				_id: req.params.id,
			}).populate(['cliente', 'pagamento', 'entrega']);

			pedido.carrinho = await Promise.all(
				pedido.carrinho.map(async (item) => {
					item.produto = await Produto.findById(item.produto);
					item.variacao = await Variacao.findById(item.variaca);
					return item;
				})
			);

			return res.send({ pedido });
		} catch (e) {
			next(e);
		}
	}

	// post / store

	async store(req, res, next) {
		const { carrinho, pagamento, entrega } = req.body;
		const { loja } = req.params;

		try {
			// Modulo 12 - api  pedidos -  atualizando  e corrigindo  as rotas e controller  de clientes em pedidos

			// CHECAR DADOS DO CARRINHO
			if (!CarrinhoValidation(carrinho))
				return res.status(422).send({ error: 'carrinho inválido' });

			/*


			// CHECAR DADOS DO ENTREGA
			if (!EntregaValidation(carrinho, entrega))
				return res
					.status(422)
					.send({ error: 'Dados de entrega inválido' });

			// CHECAR DADOS DO PAGAMENTO
			if (!PagamentoValidation(carrinho, pagamento))
				return res
					.status(422)
					.send({ error: 'Dados de pagamento inválido' });
            */

			const cliente = await Cliente.findOne({ usuario: req.paylod.id });

			const novoPagamento = new Pagamento({
				valor: pagamento.valor,
				forma: pagamento.forma,
				status: 'iniciando',
				paylod: pagamento,
				loja,
			});

			const novaEntrega = new Entrega({
				status: 'nao_iniciado',
				custo: entrega.custo,
				prazo: entrega.prazo,
				payload: entrega,
				loja,
			});

			const pedido = new Pedido({
				cliente: cliente._id,
				carrinho,
				pagamento: novoPagamento._id,
				entrega: novaEntrega._id,
			});

			novoPagamento.pedido = pedido._id;
			novaEntrega.pedido = pedido._id;

			await pedido.save();
			await novoPagamento.save();
			await novaEntrega.save();

			// 	 notificar via e-mail cliente e administrador = novo pedido

			return res.send({
				pedido: Object.assign({}, pedido, {
					entrega: novaEntrega,
					pagamento: novoPagamento,
					cliente,
				}),
			});
		} catch (e) {
			next(e);
		}
	}

	// delete /:id - remove
	async remove(req, res, next) {
		try {
			const cliente = await Cliente.findById({ usuario: req.paylod.id });
			if (!cliente)
				return res
					.status(400)
					.send({ error: 'cliente não encontrado' });
			const pedido = await Pedido.findOne({
				cliente: cliente._id,
				_id: req.params.id,
			});
			if (!pedido)
				return res.status(400).send({ error: 'Pedido não encontrado' });

			pedido.cancelado = true;

			// Registro de atividade = pedido cancelado.
			// enviar e-mail para admin = pedido.cancelado.

			await pedido.save();

			return res.send({ cancelado: true });
		} catch (e) {
			next(e);
		}
	}

	// get /:id/carrinho - showCarrinhoPedido

	async showCarrinhoPedido(req, res, next) {
		try {
			const cliente = await Cliente.findOne({ usuario: req.paylod.id });
			const pedido = await Pedido.findOne({
				cliente: cliente._id,
				_id: req.params.id,
			});
			pedido.carrinho = await Promise.all(
				pedido.carrinho.map(async (item) => {
					item.produto = await Produto.findById(item.produto);
					item.variacao = await Variacao.findById(item.variacao);
					return item;
				})
			);

			return res.send({ carrinho: pedido.carrinho });
		} catch (e) {
			next(e);
		}
	}

	//-----------------------
}

module.exports = PedidoController;
