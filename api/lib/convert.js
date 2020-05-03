const convertAPI = require('convertapi')(process.env.CONVERT_API_SECRET);
const axios = require('axios');

module.exports = async (fileName) => {
	let response;
	response = await convertAPI.convert('png', {
		File: fileName,
		ImageHeight: 1000,
		ImageWidth: 680,
		ScaleImage: true,
		ScaleProportions: true,
	});
	response = await axios({
		url: response.file.url,
		responseType: 'arraybuffer',
	});
	return response.data;
};
