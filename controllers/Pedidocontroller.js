// Modulo 12 -  Api pedidos - criando o controller para administradores.

const mongoose = require('mongoose');
const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');
const Cliente = mongoose.model('Cliente');

//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
// para registros de pedidos.

const RegistroPedido = mongoose.model('RegistroPedido');

// Modulo 12 - api  pedidos -  atualizando  e corrigindo  as rotas e controller  de clientes em pedidos
const CarrinhoValidation = require('./validacoes/carrinhoValidation');

//Módulo 13 - integraçao: entrega(correios)  - integraçaõ com correios e testes

const { calcularFrete } = require('./integracoes/correios');

// Módulo 14 -  api - entrega criando a validação de valor de
// entrega  para novos pedidos.

const EntregaValidation = require('./validacoes/entregaValidation');

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

			//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
			// para registros de pedidos.

			const registros = await RegistroPedido.find({ pedido: pedido._id });

			return res.send({ pedido, registros });
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

			//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
			// para registros de pedidos.

			const registroPedido = new RegistroPedido({
				pedido: pedido._id,
				tipo: 'pedido',
				situacao: 'pedido-cancelado',
			});

			await registroPedido.save();

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
		const { offset, limit, loja } = req.query;

		try {
			const cliente = await Cliente.findOne({ usuario: req.payload.id });
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
			const cliente = await Cliente.findOne({ usuario: req.payload.id });
			const pedido = await Pedido.findOne({
				cliente: cliente._id,
				_id: req.params.id,
			}).populate(['cliente', 'pagamento', 'entrega']);

			pedido.carrinho = await Promise.all(
				pedido.carrinho.map(async (item) => {
					item.produto = await Produto.findById(item.produto);
					item.variacao = await Variacao.findById(item.variacao);
					return item;
				})
			);

			//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
			// para registros de pedidos.

			const registros = await RegistroPedido.find({ pedido: pedido._id });

			//Módulo 13 - integraçao: entrega(correios)  - integraçaõ com correios e testes

			/*
			 teste 
			const resultado = await calcularFrete({
				cep: '38740182',
				produtos: pedido.carrinho,
			});

			return res.send({ resultado });
            */
			return res.send({ pedido, registros });
		} catch (e) {
			next(e);
		}
	}

	// post / store

	async store(req, res, next) {
		const { carrinho, pagamento, entrega } = req.body;
		const { loja } = req.query;

		try {
			// Modulo 12 - api  pedidos -  atualizando  e corrigindo  as rotas e controller  de clientes em pedidos

			// CHECAR DADOS DO CARRINHO
			if (!(await CarrinhoValidation(carrinho)))
				return res.status(422).send({ error: 'carrinho inválido' });

			//Módulo 14 - api entrega  - criando  a validação de valor de
			// entrega  para novos pedidos

			const cliente = await Cliente.findOne({ usuario: req.payload.id });

			//Módulo 14 - api entrega  - criando  a validação de valor de
			// entrega  para novos pedidos

			// CHECAR DADOS DO ENTREGA
			if (
				!(await EntregaValidation.checarValorPrazo(
					cliente.endereco.CEP,
					carrinho,
					entrega
				))
			)
				return res
					.status(422)
					.send({ error: 'Dados de entrega inválido' });
			/*

			// CHECAR DADOS DO PAGAMENTO
			if (
				!(await PagamentoValidation(
					
					carrinho,
					pagamento
				))
			)
				return res
					.status(422)
					.send({ error: 'Dados de pagamento inválido' });

			 */

			const novoPagamento = new Pagamento({
				valor: pagamento.valor,
				forma: pagamento.forma,
				status: 'iniciando',
				payload: pagamento,
				loja,
			});

			const novaEntrega = new Entrega({
				status: 'nao_iniciado',
				custo: entrega.custo,
				prazo: entrega.prazo,
				tipo: entrega.tipo,
				payload: entrega,
				loja,
			});

			const pedido = new Pedido({
				cliente: cliente._id,
				carrinho,
				pagamento: novoPagamento._id,
				entrega: novaEntrega._id,
				loja,
			});

			novoPagamento.pedido = pedido._id;
			novaEntrega.pedido = pedido._id;

			await pedido.save();
			await novoPagamento.save();
			await novaEntrega.save();

			//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
			// para registros de pedidos.

			const registroPedido = new RegistroPedido({
				pedido: pedido._id,
				tipo: 'pedido',
				situacao: 'pedido-criado',
			});

			await registroPedido.save();

			// 	 notificar via e-mail cliente e administrador = novo pedido

			return res.send({
				pedido: Object.assign({}, pedido._doc, {
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
			const cliente = await Cliente.findOne({ usuario: req.payload.id });
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

			//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
			// para registros de pedidos.

			const registroPedido = new RegistroPedido({
				pedido: pedido._id,
				tipo: 'pedido',
				situacao: 'pedido-cancelado',
			});

			await registroPedido.save();

			return res.send({ cancelado: true });
		} catch (e) {
			next(e);
		}
	}

	// get /:id/carrinho - showCarrinhoPedido

	async showCarrinhoPedido(req, res, next) {
		try {
			const cliente = await Cliente.findOne({ usuario: req.payload.id });
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
