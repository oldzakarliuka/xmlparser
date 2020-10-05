import './index.scss';

import Printer from './printer';

document.getElementById('inxml').addEventListener('change', function () {
	var fr = new FileReader();
	fr.onload = function () {
		parseXML(fr.result);
	};
	fr.readAsText(this.files[0]);
});

const parseXML = (doc) => {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(doc, 'text/xml');

	const rootTag = xmlDoc.documentElement.tagName;
	const rootNode = xmlDoc.getElementsByTagName(rootTag)[0];

	const root = document.createElement('div');
	root.className = 'output__root';

	let textBuffer = '';

	const collectionTagName = rootNode.firstElementChild.tagName;
	const collection = xmlDoc.getElementsByTagName(collectionTagName);
	const all = collection[0].getElementsByTagName('*');
	const tagNames = Array.prototype.map.call(all, (item) => item.tagName);
	for (let i = 0; i < collection.length; i++) {
		const collectionItem = collection[i];
		const item = document.createElement('div');
		item.className = 'output__box';

		const t = tagNames.reduce((acc, tag) => {
			const o = { ...acc };
			const val = collectionItem.getElementsByTagName(tag)[0].childNodes[0].nodeValue.trim();
			if (val) {
				o[tag] = val;
			}
			return o;
		}, {});

		const printerI = new Printer(t);
		textBuffer += collectionTagName + '\n' + printerI.toText() + '\n';
		item.innerHTML = `<h3>${collectionTagName}</h3>` + printerI.toHTML();
		root.appendChild(item);
	}

	const output = document.getElementById('output');
	output.innerHTML = `<h2 class="title"> ${rootTag} </h2>`;
	output.appendChild(root);
	downloadToFile(textBuffer, `${rootTag}.txt`, 'text/plain');
};

const downloadToFile = (content, filename, contentType) => {
	const a = document.createElement('a');
	const file = new Blob([content], { type: contentType });

	a.href = URL.createObjectURL(file);
	a.download = filename;
	a.innerHTML = `Download ${filename}`;

	a.click();
	URL.revokeObjectURL(a.href);
};
