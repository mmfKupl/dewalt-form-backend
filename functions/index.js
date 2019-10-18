const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const mailConf = require('./mailer.config');
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

const sendMailPromise = function(data) {
	const mailOptions = {
		from: mailConf.user,
		to: data.to, //'ivan.kuplevich.w@gmail.com',
		subject: data.subject, //'Sending Email using Node.js',
		text: data.text //'That was easy!'
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
};

exports.sendMail = functions.https.onCall(async (data, context) => {
	if (!data.to && !data.subject && !data.text) {
		throw Error('invalid data');
	}
	return await sendMailPromise(data);
});
