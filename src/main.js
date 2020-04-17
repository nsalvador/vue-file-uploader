import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import moment from 'moment';

Vue.config.productionTip = false;

Vue.filter('fileSize', (bytes, si = false) => {
	/* Date: 4-13-2020 | Source: https://stackoverflow.com/a/14919494 */
	const thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) return `${bytes} B`;
	const units = si ? ['kB', 'MB', 'GB'] : ['KiB', 'MiB', 'GiB'];
	let u = -1;
	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);
	return `${bytes.toFixed(1)} ${units[u]}`;
});

Vue.filter('lastModified', (date) => {
	return moment(date).format('MMMM Do, YYYY');
});

new Vue({
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
