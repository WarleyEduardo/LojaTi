/* modulo  18  
  (Extra) api notificações por email 
  Criando controller para notifiçãoes  por e-mail  e atualizando  funcionalidades.
*/
const transporter = require("nodemailer").createTransport(require('../config/email'));
const { loja: link } = require('../config/index');
const moment = require("moment");

const _send = ({ subject, emails, message }, cb = null) => {
	
	const mailOptions = {

		from: "warleydesenvolvimento@gmail.com",
		to: emails,
		subject,
		html: message		

	};

	if (process.env.NODE.ENV === "production") {
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


}
// pedido cancelado

const cancelarPedido = ({ usuario, pedido }) => {
	
}
// atualização de pagamento e entrega 

const atualizarPedido = ({ usuario, pedido, status, data, tipo }) => {
	
}

module.exports = {

	enviarNovoPedido,
	cancelarPedido,
	atualizarPedido

};