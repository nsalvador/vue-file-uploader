const express = require('express');
const path = require('path');

const s3 = require('./lib/s3');
const multer = require('./lib/multer');

const router = new express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.get('/bucket', async (req, res) => {
	const response = await s3.listObjects({
		Bucket: process.env.AWS_BUCKET
	});
	res.send(response.Contents);
});

router.post('/upload', multer.single('file'), async (req, res) => {
	const file = req.file;
	try {
		await s3.upload({
			ACL: 'public-read',
			Bucket: process.env.AWS_BUCKET,
			Key: file.originalname,
			ContentType: file.mimetype,
			ContentEncoding: file.encoding,
			Body: file.buffer
		});
		res.send();
	} catch (error) {
		res.send({ error: 'Upload Failed.' });
	}
});

module.exports = router;
