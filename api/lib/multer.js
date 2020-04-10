const multer = require('multer');

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['application/pdf'];
	if (!allowedTypes.includes(file.mimetype)) {
		const error = new Error('Incorrect File');
		error.code = 'INCORRECT_FILETYPE';
		return cb(error, false);
	}
	cb(null, true);
};

module.exports = multer({ fileFilter });
