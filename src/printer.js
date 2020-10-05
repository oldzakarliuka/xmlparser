function printer(val) {
	Object.keys(val).forEach((key) => {
		this[key] = val[key];
	});
}

printer.prototype.toHTML = function () {
	return Object.keys(this).reduce((acc, key) => {
		return acc + `<p class="box__item">${key}: <span>${this[key]}</span></p>`;
	}, '');
};

printer.prototype.toText = function () {
	return Object.keys(this).reduce((acc, key) => {
		return acc + `${key}: ${this[key]}\n`;
	}, '');
};

export default printer;
