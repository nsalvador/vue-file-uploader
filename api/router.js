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
		const { contents } = req.body;
		const Objects = contents.map((Key) => ({ Key }));
		await s3.deleteObjects({
			Bucket: process.env.AWS_BUCKET,
			Delete: { Objects },
		});
		res.send({ description: 'Deletion successful' });
	} catch (e) {
		res.status(500).send({ description: 'Deletion failed' });
	}
});

router.get('/bucket', async (req, res) => {
	try {
		const response = await s3.listObjects({
			Bucket: process.env.AWS_BUCKET,
		});
		res.send(response.Contents);
	} catch (e) {
		res
			.status(500)
			.send({ description: 'Failed to get the contents of bucket' });
	}
});

router.post('/upload', multer.single('file'), async (req, res) => {
	try {
		const { isConverted } = req.query;
		const { file } = req;
		if (+isConverted) {
			console.log('File has been converted to image and upload to bucket.');
		} else {
			await s3.upload({
				ACL: process.env.AWS_ACL,
				Bucket: process.env.AWS_BUCKET,
				Key: file.originalname,
				ContentType: file.mimetype,
				ContentEncoding: file.encoding,
				Body: file.buffer,
			});
		}
		res.send();
	} catch (e) {
		res.status(500).send({ description: 'Upload failed' });
	}
});

module.exports = router;
