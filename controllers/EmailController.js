/* modulo  18  
  (Extra) api notificações por email 
  Criando controller para notifiçãoes  por e-mail  e atualizando  funcionalidades.
*/
const transporter = require("nodemailer").createTransport(require('../config/email'));
const { loja } = require('../config/index');
const moment = require("moment");

const _send = ({ subject, emails, message }, cb = null) => {
	
	const mailOptions = {

		from: "warleydesenvolvimento@gmail.com",
		to: emails,
		subject,
		html: message		

	};
	
	if (process.env.NODE_ENV === "production") {
		transporter.sendMail(mailOptions, function (error, inf) {
			 
			if (error) {
				console.warn(error);
				if (cb) return cb(error);
			} else {
				if (cb) return cb(null, true);
			}

		});

	} else {
		console.log(mailOptions);
		if (cb) return cb(null, true);
	}
};

// novo pedido

const enviarNovoPedido = ({ usuario, pedido }) => { 

	const message = `
	<h1 style="text-align:center;">Pedido Recebido</h1>
	<br />
	<p>O pedido realizado hoje, no dia ${moment(pedido.createdAt).format("DD/MM/YYYY")}, 
	foi recebido com sucesso. 
	</p>
	<br />
	<a href="${loja}">Acesse a loja  para saber mais.</a>
	<br /s><br />
	<p>Atenciosamente</p>
	<p>Equipe -  Loja TI</p>
	`

	_send({
		subject: "Pedido recebido - loja ti ",
		emails: usuario.email,
		message
	})

}
// pedido cancelado

const cancelarPedido = ({ usuario, pedido }) => {

		const message = `
	<h1 style="text-align:center;">Pedido Cancelado</h1>
	<br />
	<p>O pedido feito no dia ${moment(pedido.createdAt).format('DD/MM/YYYY')}, 
	foi cancelado. 
	</p>
	<br />
	<a href="${loja}">Acesse a loja  para saber mais.</a>
	<br /s><br />
	<p>Atenciosamente</p>
	<p>Equipe -  Loja TI</p>
	`;

		_send({
			subject: 'Pedido cancelado - loja ti ',
			emails: usuario.email,
			message,
		});
	
}
// atualização de pagamento e entrega 

const atualizarPedido = ({ usuario, pedido, status, data, tipo }) => {
	
	const message = `
	<h1 style="text-align:center;">Pedido atualizado</h1>
	<br />
	<p>O feito, no dia ${moment(pedido.createdAt).format('DD/MM/YYYY')}, 
	teve uma atualizado. 
	</p>
	<br />
	<p>Nova atualização: ${status} - realizado em ${moment(data).format('DD/MM/YYYY HH:mm')}</p>
	<a href="${loja}">Acesse a loja  para saber mais.</a>
	<br /s><br />
	<p>Atenciosamente</p>
	<p>Equipe -  Loja TI</p>
	`;

		_send({
			subject: 'Pedido atualizado - loja ti ',
			emails: usuario.email,
			message,
		});
	
}


// preferir manter separado o email de atualizado do pedido da entrega
const atualizarEntrega = ({ usuario, pedido, status, data, tipo , codigoRastreamento }) => {
	const message = `
	<h1 style="text-align:center;">Entrega do pedido atualizado</h1>
	<br />
	<p>O feito, no dia ${moment(pedido.createdAt).format('DD/MM/YYYY')}, 
	teve uma atualizado na entrega. 
	</p>
	<br />
	<p>Nova atualização: ${status} - realizado em ${moment(data).format('DD/MM/YYYY HH:mm')}</p>
	<p>Acompanhe a entrega pelo codigo de rastreamento: ${codigoRastreamento} </p>
	<a href="${loja}">Acesse a loja  para saber mais.</a>
	<br /s><br />
	<p>Atenciosamente</p>
	<p>Equipe -  Loja TI</p>
	`;

	_send({
		subject: 'Pedido atualizado - loja ti ',
		emails: usuario.email,
		message,
	});
};

module.exports = {

	enviarNovoPedido,
	cancelarPedido,
	atualizarPedido,
	atualizarEntrega

};