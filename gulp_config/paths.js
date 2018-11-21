
//Base template css and js files

var plugins = require('./plugins'),
    assets = require('./assets'),
    gulpedJsNames = [],
    gulpedCssNames = [],
    paths={};

for (var i = 0; i < assets.JsNames.length; i++) {
    var JsName = 'js/'+ assets.JsNames[i];
    gulpedJsNames.push(JsName); 
}

for (var i = 0; i < assets.CSS.length; i++) {
    var cssName = 'css/'+ assets.CSS[i];
    gulpedCssNames.push(cssName); 
}

//plugins css and js files
for (var i = 0; i < plugins.length; i++) {
    var plugin = require('./'+ plugins[i] +'/assets'),
        jsFiles = plugin.JsNames,
        cssFiles = plugin.CSS;
    
    for (var j = 0; j < jsFiles.length; j++) {
        var JsName = 'js/'+ plugins[i] +'/'+ jsFiles[j];
        gulpedJsNames.push(JsName);
    }
    
    for (var j = 0; j < cssFiles.length; j++) {
        var cssName = 'css/'+ plugin[i] +'/'+ cssFiles[j];
        gulpedCssNames.push(cssName);
    }
}

paths.gulpedJsNames = gulpedJsNames;
paths.gulpedCssNames = gulpedCssNames;
paths.sassFiles = '_scss/**/*.scss'; 
paths.cssFiles = 'css'; 

module.exports = paths;