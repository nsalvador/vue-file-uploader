const convertAPI = require('convertapi')(process.env.CONVERT_API_SECRET);
const axios = require('axios');
const writeToFile = require('./writeToFile');
const unlink = require('./unlink');

module.exports = async (buffer) => {
	const File = await writeToFile(buffer);
	let response = await convertAPI.convert('png', {
		File,
		ImageHeight: 1000,
		ImageWidth: 680,
		ScaleImage: true,
		ScaleProportions: true,
	});
	const url = response.file.url;
	response = await axios({
		url,
		responseType: 'arraybuffer',
	});
	await unlink(fileName);
	return response.data;
};
