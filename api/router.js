const express = require('express');
const path = require('path');

const s3 = require('./lib/s3');
const multer = require('./lib/multer');

const router = new express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.delete('/', async (req, res) => {
	try {
		const Key = req.body.Key;
		await s3.deleteObjects({
			Bucket: process.env.AWS_BUCKET,
			Delete: {
				Objects: [{ Key }],
			},
		});
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.get('/bucket', async (req, res) => {
	try {
		const response = await s3.listObjects({
			Bucket: process.env.AWS_BUCKET,
		});
		res.send(response.Contents);
	} catch (error) {
		res.status(500).send();
	}
});

router.post('/upload', multer.single('file'), async (req, res) => {
	const file = req.file;
	try {
		await s3.upload({
			ACL: process.env.AWS_ACL,
			Bucket: process.env.AWS_BUCKET,
			Key: file.originalname,
			ContentType: file.mimetype,
			ContentEncoding: file.encoding,
			Body: file.buffer,
		});
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
