// Módulo 14 -  api entrega - criando  controller para entrega.

const mongoose = require('mongoose');
const Entrega = mongoose.model('Entrega');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const RegistroPedido = mongoose.model('RegistroPedido');
const { calcacularFrete } = require('../controllers/integracoes/correios');

class EntregaController {
	// get /:id  show

	async show(req, res, next) {
		try {
			const entrega = await Entrega.findOne({
				_id: req.params.id,
				loja: req.query.loja,
			});
			const registros = await RegistroPedido.findOne({
				pedido: entrega.pedido,
				tipo: 'entrega',
			});
			return res.send({ entrega, registros });
		} catch (e) {
			next(e);
		}
	}

	// put /:id

	async update(req, res, next) {
		const { situacao, codigoRastreamento } = req.body;
		const { loja } = req.query;

		try {
			const entrega = await Entrega.findOne({ loja, _id: req.params.id });

			if (situacao) entrega.situacao = situacao;
			if (codigoRastreamento)
				entrega.codigoRastreamento = codigoRastreamento;

			const registroPedido = new RegistroPedido({
				pedido: entrega.pedido,
				tipo: 'entrega',
				situacao,
				payload: req.body,
			});

			await registroPedido.save();

			// enviar e-mail de aviso para o cliente - aviso de atualizaão de entrega

			await entrega.save();
			return res.send({ entrega });
		} catch (e) {
			next(e);
		}
	}

	// post / calcular

	async calcular(req, res, next) {
		const { cep, carrinho } = req.body;

		try {
			const _carrinho = await Promisse.all(
				carrinho.map(async (item) => {
					item.produto = await Produto.findById(item.produto);
					item.variacao = await Varicao.findById(item.variacao);

					return item;
				})
			);

			const resultados = await calcacularFrete(cep, _carrinho);

			return res.send({ resultados });
		} catch (e) {
			next(e);
		}
	}
}

module.exports = EntregaController;
