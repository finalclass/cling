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
    var stylFileTemplate = '@import "nib";\n\n.{{dash-component}} {\n}',
        htmlFileTemplate = '<div class="{{dash-component}}">\n</div>',
        jsFileTemplate = "" +
            "/*jshint node:true*/\n" +
            "/*global {{cc-module}}*/\n" +
            "\n" +
            "(function () {\n" +
            "   'use strict';\n" +
            "\n" +
            "   {{cc-module}}.directive('{{cc-component}}', function () {\n" +
            "       return {\n" +
            "           restrict: 'E',\n" +
            "           templateUrl: '{{template-url}}',\n" +
            "           controller: ['$scope',\n" +
            "               function ($scope) {\n" +
            "           }]\n" +
            "       };\n" +
            "   });\n" +
            "}());",
        dashModuleName = argv[2],
        dashComponentName,
        dashSubModuleName,
        ccSubModuleName,
        filePath,
        ccModuleName,
        ccComponentName,
        uccComponentName,
        templateCompile,
        styl, js, html, dir,
        templateUrl,
        ccComponent,
        dashComponent,
        uccSubModuleName;

    if (argv[5]) {
        dashComponentName = argv[5];
        dashSubModuleName = argv[4];
    } else {
        dashComponentName = argv[4];
        dashSubModuleName = '';
    }

    ccSubModuleName = dashToCamelCase(dashSubModuleName);

    ccModuleName = dashToCamelCase(dashModuleName);
    ccComponentName = dashToCamelCase(dashComponentName);
    uccComponentName = dashToUpperCamelCase(dashComponentName);
    uccSubModuleName = dashToUpperCamelCase(dashSubModuleName);

    if (ccSubModuleName) {
        templateUrl = '/' + dashModuleName + '/views/' + dashSubModuleName + '/' + dashComponentName + '/' + dashComponentName + '.html';
        dashComponent = dashModuleName + '-' + dashSubModuleName + '-' + dashComponentName;
        ccComponent = ccModuleName + uccSubModuleName + uccComponentName;
    } else {
        templateUrl = '/' + dashModuleName + '/views/' + dashComponentName + '/' + dashComponentName + '.html';
        dashComponent = dashModuleName + '-' + dashComponentName;
        ccComponent = ccModuleName + uccComponentName;
    }

    templateCompile = function (template) {
        return template
            .replace(/\{\{template\-url\}\}/g, templateUrl)
            .replace(/\{\{cc\-module\}\}/g, ccModuleName)
            .replace(/\{\{cc\-component\}\}/g, ccComponent)
            .replace(/\{\{dash\-component\}\}/g, dashComponent);
    },
    styl = templateCompile(stylFileTemplate);
    js = templateCompile(jsFileTemplate);
    html = templateCompile(htmlFileTemplate);

    if (dashSubModuleName) {
        if (!fs.existsSync(process.cwd() + '/' + dashSubModuleName)) {
            fs.mkdirSync(process.cwd() + '/' + dashSubModuleName);
        }
        fs.mkdirSync(process.cwd() + '/' + dashSubModuleName + '/' + dashComponentName);
        filePath = process.cwd() + '/' + dashSubModuleName + '/' + dashComponentName + '/' + dashComponentName;
    } else {
        fs.mkdirSync(process.cwd() + '/' + dashComponentName);
        filePath = process.cwd() + '/' + dashComponentName + '/' + dashComponentName;
    }

    fs.writeFileSync(filePath + '.html', html, {encoding: 'utf-8'});
    fs.writeFileSync(filePath + '.styl', styl, {encoding: 'utf-8'});
    fs.writeFileSync(filePath + '.js', js, {encoding: 'utf-8'});

    console.log('DONE');
}

run();