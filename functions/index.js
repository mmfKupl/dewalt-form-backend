const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const mailConf = require('./mailer.config');
const js2xmlparser = require('js2xmlparser');
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

exports.sendMail = functions.https.onCall(
	async ({ user, answer, answerHtml, sendTime }, context) => {
		if (!user || !answer || !answerHtml || !sendTime) {
			throw Error('invalid data');
		}
		const htmlToUser = await compileHtml(answerHtml);
		const htmlToAdmin = await compileHtml(answerHtml, false, {
			sendTime,
			user
		});
		const attachment = createXmlAttachment(Object.assign({}, answer));
		const photos = answer.tools.map(elem => {
			const el = elem.find(el => el.isFile);
			return {
				failname: el.value.path.split('/').pop(),
				path: el.value.url
			};
		});
		console.log(photos);
		try {
			return await Promise.all([
				sendMailPromise(user, htmlToUser),
				sendMailPromise(
					/*mailConf.user*/ 'ikuplevich97@gmail.com',
					htmlToAdmin,
					[attachment, ...photos]
				)
			]);
		} catch (err) {
			return err;
		}
	}
);

function sendMailPromise(user, html, attachments) {
	const mailOptions = {
		from: mailConf.user,
		to: user,
		subject: 'Заявка на ремонт инструмента',
		html: html,
		attachments
	};
	return new Promise((res, rej) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error.message);
				rej(error.message);
			} else {
				console.log(info);
				res(info.response);
			}
		});
	});
}

function compileHtml(
	htmlBody = '',
	forUser = true,
	sendData = { sendTime: 0, user: 0 }
) {
	let html = `<html>
							<head>
								<style>
									${styles}
								</style> 
								<link rel="stylesheet" href="style.css">
							</head><body>`;
	if (forUser) {
		html += `<h1>Доброе время суток!</h1>
						<p>
							К нам поступила заявка ремонт инструмента, в ближайшее время мы ее обработаем.
						</p>`;
	} else {
		html += `<h1>Поступила новая заявка от: ${sendData.user}; ${new Date(
			sendData.sendTime
		).toDateString()}</h1>`;
	}
	html += `<p>Данные заявки:</p>
							${htmlBody}
					</body>
					</html>`;

	return inlineCss(html, {
		applyStyleTags: true,
		applyLinkTags: false,
		url: ' '
	});
}

function createXmlAttachment(data = {}) {
	for (const key in data) {
		const subKey = `${key}Data`;
		data[key] = {
			[subKey]: data[key]
		};
		data[key][subKey] = data[key][subKey].map(elem => {
			if (Array.isArray(elem)) {
				const changedElem = { toolDataTopick: elem };
				elem = changedElem;
			} else {
				elem['@'] = { key: elem['key'] };
				delete elem['key'];
			}

			return elem;
		});
	}

	return {
		filename: 'data.xml',
		content: new Buffer(js2xmlparser.parse('data', data), 'utf-8')
	};
}
