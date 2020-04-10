const express = require('express');

const path = require('path');

const multer = require('multer');

const s3 = require('./aws');

const app = express();

const PORT = process.env.PORT || 5000;

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['application/pdf'];
	if (!allowedTypes.includes(file.mimetype)) {
		const error = new Error('Incorrect File');
		error.code = 'INCORRECT_FILETYPE';
		return cb(error, false);
	}
	cb(null, true);
};

const upload = multer({
	fileFilter
});

app.use(express.static(path.join(__dirname, '../dist')));

app.use((err, req, res, next) => {
	if (err.code === 'INCORRECT_FILETYPE') {
		return res.status(422).json({ error: 'Only pdf files are allowed' });
	}
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/bucket', async (req, res) => {
	const response = await s3.listObjects({
		Bucket: process.env.AWS_BUCKET
	});
	res.send(response.Contents);
});

app.post('/upload', upload.single('file'), async (req, res) => {
	const file = req.file;
	await s3.upload({
		Bucket: process.env.AWS_BUCKET,
		Key: file.originalname,
		ACL: 'public-read',
		ContentType: file.mimetype,
		ContentEncoding: file.encoding,
		Body: file.buffer
	});
	res.send();
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
