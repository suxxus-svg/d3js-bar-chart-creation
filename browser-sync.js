var bs = require('browser-sync').create();
var proxy = require('proxy-middleware'),
    url = require('url'),
    proxy_options = function(value) {
        var proxyOptions = url.parse(value);
        proxyOptions.route = '/api';
        return proxyOptions;
    };

bs.watch('./src/*').on('change', bs.reload);
bs.init({
    server: {
        name: 'dev',
        baseDir: './src',
        middleware: [proxy(proxy_options('http://localhost:4000/api'))]
    },
    port: 3500,
    ui: {
        port: 3012
    },
    reloadDelay: 1000
});
