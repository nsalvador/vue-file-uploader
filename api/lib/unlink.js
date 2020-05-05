const fs = require('fs');

module.exports = (fileName) => {
	return new Promise((resolve, reject) => {
		fs.unlink(fileName, (error) => {
			if (error) return reject(error);
			resolve();
		});
	});
};
