const { styles } = require('./table.style');
const inlineCss = require('inline-css');

const table = `<table _ngcontent-spe-c3="" class="table"><tr _ngcontent-spe-c3="" class="table__tr table__label"><td _ngcontent-spe-c3="" class="table__td" colspan="2"> Отправитель </td></tr><!----><tr _ngcontent-spe-c3="" class="table__tr table__space"><td _ngcontent-spe-c3=""></td></tr><tr _ngcontent-spe-c3="" class="table__tr table__label"><td _ngcontent-spe-c3="" class="table__td" colspan="2"> Адрес загрузки </td></tr><!----><tr _ngcontent-spe-c3="" class="table__tr table__space"><td _ngcontent-spe-c3=""></td></tr><tr _ngcontent-spe-c3="" class="table__tr table__label"><td _ngcontent-spe-c3="" class="table__td" colspan="2"> Инструменты </td></tr><!----><tr _ngcontent-spe-c3="" class="table__tr table__space"><td _ngcontent-spe-c3=""></td></tr><tr _ngcontent-spe-c3="" class="table__tr table__label"><td _ngcontent-spe-c3="" class="table__td" colspan="2"> Отправление </td></tr><!----></table>`;

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
								${table}
							</body>
							</html>`;

inlineCss(html, {
	applyStyleTags: true,
	applyLinkTags: false,
	url: ' '
})
	.then(data => console.log(data))
	.catch(err => console.log(err));
