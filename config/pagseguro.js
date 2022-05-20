/*
   modulo 15  - api  integração pagseguro 
   criando arquivo de configuração.
 */

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
	sandbox: process.env.NODE_ENV === 'production' ? false : true,
	sandbox_email: process.env.NODE_ENV === 'production' ? null : 'c14265090554938550912@sandbox.pagseguro.com.br',
	email: 'warleyeduardo@hotmail.com',
	token: '86C2E7E50E7645A28FE231946414483F',
	notificationURL: 'http://localhost:3000/v1/api/pagamentos/notificacao',
};
