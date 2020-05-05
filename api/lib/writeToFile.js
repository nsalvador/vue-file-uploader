const path = require('path');
const fs = require('fs');

module.exports = (buffer) => {
	return new Promise((resolve, reject) => {
		const fileName = path.resolve(__dirname, '../temp.pdf');
		const writeStream = fs.createWriteStream(fileName);
		writeStream.write(buffer);
		writeStream
			.on('finish', () => {
				resolve(fileName);
			})
			.on('error', (error) => {
				reject(error);
			});
		writeStream.end();
	});
};
