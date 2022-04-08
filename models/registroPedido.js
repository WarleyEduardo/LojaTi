//Modulo 12 - api pedidos -  (Extra) criando modelo e funcionalidades
// para registros de pedidos.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistroPedidoSchema = Schema(
	{
		pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true },
		tipo: { type: String, required: true },
		situacao: { type: String, required: true },
		data: { type: Date, default: Date.now },
		payload: { type: Object },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('RegistroPedido', RegistroPedidoSchema);
