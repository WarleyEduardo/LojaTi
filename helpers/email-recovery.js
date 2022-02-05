const transporter = require('nodemailer').createTransport(
	require('../config/email')
);

const { api: link } = require('../config/index');

module.exports = ({ usuario, recovery }, cb) => {
	const message = `<h1 style="text-align:center;">Recuperação de senha </h1>
	                 <br />
					 <p>
					   Aqui está o link para redefinir sua senha. acesse ele e digite sua nova senha:
					 </p>
					 <a href="${link}/v1/api/usuarios/senha-recuperada?token=${recovery.token}">
					   ${link}/v1/api/usuarios/senha-recuperada?token=${recovery.token}
					 </a>
					 <br /> <br /> <hr />
					 <p>
					   Obs.: Se você não solicitou  a redefinição,apenas ignore esse email.
					 </p>
					 <br />
					 <p>Atenciosamente Loja TI </p>
					  `;
	const opcoesEmail = {
		from: 'naoresponder@lojati.com',
		to: usuario.email,
		subject: 'Redefinição de senha Loja TI',
		html: message,
	};

	if (process.env.NODE_ENV === 'production') {
		transporter.sendMail(opcoesEmail, (error, info) => {
			if (error) {
				console.log(error);
				return cb(
					'Aconteceu um erro no envio de email, tente novamente'
				);
			} else {
				return cb(
					null,
					'Link de redefinicao de senha foi enviado com suesso para o seu email'
				);
			}
		});
	} else {
		console.log(opcoesEmail);
		return cb(
			null,
			'Link de redefinicao de senha foi enviado com suesso para o seu email'
		);
	}
};
