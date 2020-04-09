const AWS = require('aws-sdk');

class AWSAsync {
	constructor() {
		this.config();
		this.s3 = new AWS.S3();
	}
	config() {
		AWS.config.update({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
		});
	}
	// putObject(params) {
	// 	return new Promise((resolve, reject) => {
	// 		this.s3.putObject(params, (error, data) => {
	// 			if (error) return reject(error);
	// 			resolve(data);
	// 		});
	// 	});
	// }
	upload(object) {
		return new Promise((resolve, reject) => {
			this.s3.upload(object, (error, data) => {
				if (error) return reject(error);
				resolve(data);
			});
		});
	}
}

module.exports = new AWSAsync();
