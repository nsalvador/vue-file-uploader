const express = require('express');

const path = require('path');

const router = require('./router');

module.exports = [
	express.static(path.join(__dirname, '../dist')),
	router,
	(err, req, res, next) => {
		if (err.code === 'INCORRET_FILETYPE') {
			return res.status(422).send({ error: 'Not valid file type.' });
		}
	}
];
