var vue = require('vue');
var vueRouter = require('vue-router');
var configRouter = require('./routes.js');
var filter = require('./filters/index.js');

require('./commons/styles/app.css');

//初始化过滤器
filter.init(vue);

//初始化配置项
var config = {
	entry: '#poi',
	title: 'poi - Poimoe'
}

var entry = document.getElementById('main');
var selector = config.entry.split('');
if(selector[0] !== '#' && selector[0] !== '.') {
	throw '缺少程序入口css选择器，请使用Class选择器（.）或ID选择器（＃），并在index.html中指明ID或Class';
}

var entryId = config.entry.replace('#', '');
var entryId = entryId.replace('.', '');
entry.setAttribute('id', entryId);

//初始化应用程序
vue.use(vueRouter);

var router = new vueRouter({});
configRouter(router);

var app = vue.extend(require('./app.vue'));
router.start(app, config.entry);

new vue({
	el: '#app-title',
	data: {
		title: config.title
	}
});

window.router = router;
