const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const mailConf = require('./mailer.config');
const inlineCss = require('inline-css');
const { styles } = require('./table.style');
admin.initializeApp();

var transporter = nodemailer.createTransport({
	service: mailConf.service,
	host: mailConf.host,
	port: 465,
	sequre: true,
	auth: {
		user: mailConf.user,
		pass: mailConf.pass
	}
});

exports.sendMail = functions.https.onCall(async (data, context) => {
	if (!data.to && !data.subject && !data.text) {
		throw Error('invalid data');
	}
	const html = await compileHtml(data.text);
	return await sendMailPromise(data, html);
});

function sendMailPromise({ to, subject }, html) {
	const mailOptions = {
		from: mailConf.user,
		to: to,
		subject: subject,
		html: html
	};
	return new Promise((res, rej) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error.message);
				res(error.message);
			} else {
				res(info.response);
			}
		});
	});
}

function compileHtml(htmlBody = '') {
	const html = `<html>
							<head>
								<style>
									${styles}
								</style> 
								<link rel="stylesheet" href="style.css">
							</head>
							<body>
							<h1>Доброе время суток!</h1>
							<p>
								К нам поступила заявка ремонт инструмента, в ближайшее время мы ее обработаем.
							</p>
							<p>Данные заявки:</p>
								${htmlBody.text}
							</body>
							</html>`;

	return inlineCss(html, {
		applyStyleTags: true,
		applyLinkTags: false,
		url: ' '
	});
}
