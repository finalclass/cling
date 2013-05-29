/*jshint node:true*/
'use strict';

var cssFileTemplate = '.{{dash-component}} {\n}',
    htmlFileTemplate = '<div class="{{dash-component}}">\n</div>',
    jsFileTemplate = "" +
        "/*jshint node:true*/" +
        "/*global {{cc-module-name}}*/" +
        "\n" +
        "(function() {}(" +
        "   'use strict';" +
        "\n" +
        "   {{cc-module-name}}.directive('{{cc-module-name}}{{ucc-component}}, function () {" +
        "       return {" +
        "           restrict: 'E'," +
        "           templateUrl: '/mtm/views/invoices/Invoices.html'," +
        "           scope: {" +
        "               project: '='" +
        "           }," +
        "           controller: ['$scope'," +
        "               function ($scope) {" +
        "           }]" +
        "       };" +
        "   });" +
        "));";
