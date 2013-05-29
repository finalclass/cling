/*jshint node:true*/
/*global Error*/

'use strict';

var fs = require('fs');

function UsageError() {
    this.message = 'Usage: cling dash-cased-module-name component dash-cased-component-name';
    this.stack = Error().stack;
}
UsageError.prototype = Object.create(Error.prototype);
UsageError.prototype.name = 'UsageError';

function run() {
    if (process.argv.length < 5) {
        throw new UsageError();
    }

    switch (process.argv[3]) {
    case 'component':
        component(process.argv);
        break;
    default:
        throw new UsageError();
    }

}

function dashToUpperCamelCase(text) {
    text = dashToCamelCase(text);
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function dashToCamelCase(text) {
    return text.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

function component (argv) {
    var stylFileTemplate = '@import "nib";\n\n.{{dash-module}}-{{dash-component}} {\n}',
        htmlFileTemplate = '<div class="{{dash-module}}-{{dash-component}}">\n</div>',
        jsFileTemplate = "" +
            "/*jshint node:true*/\n" +
            "/*global {{cc-module}}*/\n" +
            "\n" +
            "(function () {\n" +
            "   'use strict';\n" +
            "\n" +
            "   {{cc-module}}.directive('{{cc-module}}{{ucc-component}}', function () {\n" +
            "       return {\n" +
            "           restrict: 'E',\n" +
            "           templateUrl: '/{{cc-module}}/views/{{cc-component}}/{{ucc-component}}.html',\n" +
            "           controller: ['$scope',\n" +
            "               function ($scope) {\n" +
            "           }]\n" +
            "       };\n" +
            "   });\n" +
            "}());",
        dashModuleName = argv[2],
        dashComponentName = argv[4],
        ccModuleName = dashToCamelCase(dashModuleName),
        ccComponentName = dashToCamelCase(dashComponentName),
        uccComponentName = dashToUpperCamelCase(dashComponentName),
        templateCompile = function (template) {
            return template
                .replace(/\{\{dash\-component\}\}/g, dashComponentName)
                .replace(/\{\{dash\-module\}\}/g, dashModuleName)
                .replace(/\{\{cc\-module\}\}/g, ccModuleName)
                .replace(/\{\{cc\-component\}\}/g, ccComponentName)
                .replace(/\{\{ucc\-component\}\}/g, uccComponentName);
        },
        styl = templateCompile(stylFileTemplate),
        js = templateCompile(jsFileTemplate),
        html = templateCompile(htmlFileTemplate),
        dir = process.cwd() + '/' + ccComponentName,
        filePath = dir + '/' + uccComponentName;

    fs.mkdirSync(dir);
    fs.writeFileSync(filePath + '.html', html, {encoding: 'utf-8'});
    fs.writeFileSync(filePath + '.styl', styl, {encoding: 'utf-8'});
    fs.writeFileSync(filePath + '.js', js, {encoding: 'utf-8'});

    console.log('DONE');
}

run();