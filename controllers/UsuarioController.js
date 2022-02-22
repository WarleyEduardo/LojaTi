const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const enviarEmailRecovery = require('../helpers/email-recovery');

class UsuarioController {
	// get /

	index(req, res, next) {
		Usuario.findById(req.payload.id)
			.then((usuario) => {
				if (!usuario)
					return res
						.status(401)
						.json({ erros: 'Usuario não registrado' });
				return res.json({ usuario: usuario.enviarAuthJSON() });
			})
			.catch(next);
	}

	// get/id

	show(req, res, next) {
		Usuario.findById(req.params.id)
			.populate({ path: 'loja' })
			.then((usuario) => {
				if (!usuario)
					return res
						.status(401)
						.json({ erros: 'Usuario não registrado' });

				return res.json({
					usuario: {
						nome: usuario.nome,
						email: usuario.email,
						permissao: usuario.permissao,
						loja: usuario.loja,
					},
				});
			})
			.catch(next);
	}

	//post / registrar

	store(req, res, next) {
		const { nome, email, password, loja } = req.body;

		let campovazio = '';

		if (!nome) campovazio = 'nome';
		if (!email) campovazio = 'email';
		if (!password) campovazio = 'password';
		if (!loja) campovazio = 'loja';

		if (!nome || !email || !password || !loja)
			return res.status(422).json({
				errors: `Preenchar todos os campos. Campo vazio:  ${campovazio}`,
			});

		const usuario = new Usuario({ nome, email, loja });
		usuario.setSenha(password);

		usuario
			.save()
			.then(() => res.json({ usuario: usuario.enviarAuthJSON() }))
			.catch((err) => {
				console.log(err);
				next(err);
				return res.json({ errors: err.message });
			});
	}

	//	put /

	update(req, res, next) {
		const { nome, email, password } = req.body;
		Usuario.findById(req.payload.id)
			.then((usuario) => {
				if (!usuario)
					return res
						.status(401)
						.json({ erros: 'Usuário não registrado' });

				if (typeof nome !== 'undefined') usuario.nome = nome;
				if (typeof email !== 'undefined') usuario.email = email;
				if (typeof password !== 'undefined') usuario.setSenha(password);

				return usuario
					.save()
					.then(() => {
						return res.json({ usuario: usuario.enviarAuthJSON() });
					})
					.catch(next);
			})
			.catch(next);
	}

	// delete

	remove(req, res, next) {
		Usuario.findById(req.payload.id)
			.then(() => {
				if (!usuario)
					return res
						.status(401)
						.json({ erros: 'Usuário não registrado' });
				return usuario
					.remove()
					.then(() => {
						return res.json({ deletado: true });
					})
					.catch(next);
			})
			.catch(next);
	}

	// post /login

	login(req, res, next) {
		const { email, password } = req.body;
		/* 
		
		  Modulo 6 - Api Validações 
          Preparando e fazendo Setup da validação.
		
		if (!email)
			return res.status(422).json({ email: 'não pode ficar vazio' });
		if (!password)
			return res.status(422).json({ password: 'não pode ficar vazio' });
        
		
		*/

		Usuario.findOne({ email })
			.then((usuario) => {
				if (!usuario)
					return res
						.status(401)
						.json({ erros: 'Usuário não registrado' });
				if (!usuario.validarSenha(password))
					return res.status(401).json({ erros: 'Senha Inválida' });

				return res.json({ usuario: usuario.enviarAuthJSON() });
			})
			.catch(next);
	}

	// recovery

	// get / recuperar-senha

	showRecovery(req, res, next) {
		return res.render('recovery', { error: null, success: null });
	}

	// post / recuperar-Senha

	// POST /recuperar-senha
	createRecovery(req, res, next) {
		const { email } = req.body;
		if (!email)
			return res.render('recovery', {
				error: 'Preencha com o seu email',
				success: null,
			});

		Usuario.findOne({ email })
			.then((usuario) => {
				if (!usuario)
					return res.render('recovery', {
						error: 'Não existe usuário com este email',
						success: null,
					});
				const recoveryData = usuario.criarTokenRecuperacaoSenha();
				return usuario
					.save()
					.then(() => {
						enviarEmailRecovery(
							{ usuario, recovery: recoveryData },
							(error = null, success = null) => {
								return res.render('recovery', {
									error,
									success,
								});
							}
						);
					})
					.catch(next);
			})
			.catch(next);
	}

	// get /senha-recuperada

	showCompleteRecovery(req, res, next) {
		if (!req.query.token)
			return res.render('recovery', {
				error: 'token não identificado',
				success: null,
			});

		Usuario.findOne({ 'recovery.token': req.query.token })
			.then((usuario) => {
				if (!usuario)
					return res.render('recovery', {
						error: 'Usuário não existe com esse token',
						success: null,
					});

				if (new Date(usuario.recovery.date) < new Date())
					return res.render('recovery', {
						error: 'token expirado,tente novamente',
						success: null,
					});

				return res.render('recovery/store', {
					error: null,
					success: null,
					token: req.query.token,
				});
			})
			.catch(next);
	}

	completeRecovery(req, res, next) {
		const { token, password } = req.body;
		if (!token || !password)
			return res.render('recovery/store', {
				error: 'preencha novamente com sua nova senha',
				success: null,
				token: token,
			});

		Usuario.findOne({ 'recovery.token': token }).then((usuario) => {
			if (!usuario)
				return res.render('recovery', {
					error: 'Usuário não identificado',
					success: null,
				});

			usuario.finalizarTokenRecuperacaoSenha();
			usuario.setSenha(password);

			return usuario
				.save()
				.then(() => {
					return res.render('recovery/store', {
						error: null,
						success:
							'Senha alterada com sucesso. Tente novamente fazer login',
						toke: null,
					});
				})
				.catch(next);
		});
	}
}

module.exports = UsuarioController;
