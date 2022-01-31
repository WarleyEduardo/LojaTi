/* 
  secret é utilizado para token de validação no servidor
  api é onde a loja estara hospedada
  */

module.exports = {
	secret:
		process.env.Node_Env === 'production'
			? process.env.secret
			: 'ADS4545FDSFSDKKKDSFAKDSAFA785645DQREZ244QERA64545',
	api:
		process.env.Node_Env === 'production'
			? 'https//api.loja-teste.ampliee.com'
			: 'http//localhost:3000',

	loja:
		process.env.Node_Env === 'production'
			? 'https//loja-teste.ampliee.com'
			: 'http//localhost:8000',
};
