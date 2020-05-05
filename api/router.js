const express = require('express');
const path = require('path');
const fs = require('fs');

const s3 = require('./lib/s3');
const multer = require('./lib/multer');
const convert = require('./lib/convert');

const router = new express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.delete('/', async (req, res) => {
	try {
		const { contents } = req.body;
		const Objects = contents.map((Key) => ({ Key }));
		await s3.deleteObjects({
			Bucket: process.env.AWS_BUCKET,
			Delete: { Objects },
		});
		res.send({ message: 'Deletion successful' });
	} catch (e) {
		res.status(500).send({ message: 'Deletion failed' });
	}
});

router.get('/bucket', async (req, res) => {
	try {
		const response = await s3.listObjects({
			Bucket: process.env.AWS_BUCKET,
		});
		res.send(response.Contents);
	} catch (e) {
		res.status(500).send({ message: 'Failed to get the contents of bucket' });
	}
});

router.post('/upload', multer.single('file'), async (req, res) => {
	try {
		const { file } = req;
		const { isConverted } = req.query;
		let params = {
			ACL: process.env.AWS_ACL,
			Bucket: process.env.AWS_BUCKET,
		};
		if (+isConverted) {
			const buffer = await convert(file.buffer);
			params.Body = Buffer.from(buffer);
			params.ContentEncoding = 'base64';
			params.ContentType = 'image/png';
			params.Key = file.originalname.replace('.pdf', '.png');
		} else {
			params.Body = file.buffer;
			params.ContentEncoding = file.encoding;
			params.ContentType = file.mimetype;
			params.Key = file.originalname;
		}
		await s3.upload(params);
		res.send();
	} catch (e) {
		res.status(500).send({ message: 'Upload and/or conversion failed' });
	}
});

module.exports = router;
