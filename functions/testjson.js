const fs = require('fs');
const js2xmlparser = require('js2xmlparser');
const jsonData = fs.readFileSync('./testjson.json', 'utf8');
const data = JSON.parse(jsonData);

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

fs.writeFileSync('./data.xml', js2xmlparser.parse('data', data), 'utf8');
