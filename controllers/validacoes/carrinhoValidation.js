// Modulo 12 - api  pedidos -  atualizando  e corrigindo  as rotas e controller  de clientes em pedidos
const mongoose = require('mongoose');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');

const getCarrinhoValue = (carrinho) => {
	let precoTotal = 0;
	let quantidade = 0;

	carrinho.forEach((item) => {
		precoTotal += item.precoUnitario * item.quantidade;
		quantidade += item.quantidade;
	});

	return { precoTotal, quantidade };
};

const getLojaValue = (carrinho) => {
	const results = Promise.all(
		carrinho.map(async (item) => {
			const produto = await Produto.findById(item.produto);
			const variacao = await Varicao.findById(item.variacao);
			let preco = 0;
			let qtd = 0;

			if (
				produto &&
				variacao &&
				produto.variacoes.includes(variacao._id)
			) {
				let _preco = variacao.promocao || variacao.preco;
				preco = _preco * item.quantidade;
				qtd = item.quantidade;

				return { preco, qtd };
			}
		})
	);

	let precoTotal = results.reduce((all, item) => all + item.preco, 0);
	let quantidade = results.reduce((all, item) => all + item.qtd, 0);

	return { precoTotal, quantidade };
};

function CarrinhoValidation(carrinho) {
	const {
		precoTotal: precoTotalCarrinho,
		quantidade: quantidadeTotalCarrinho,
	} = getCarrinhoValue(carrinho);
	const { precoTotal: precotTotalLoja, quantidade: quantidadeTotalLoja } =
		getLojaValue(carrinho);

	return (
		precoTotalCarrinho === precotTotalLoja &&
		quantidadeTotalCarrinho === quantidadeTotalLoja
	);
}

module.exports = CarrinhoValidation;
