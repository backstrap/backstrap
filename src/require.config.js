var components = {
    "packages": [
        {
            "name": "backstrap",
            "main": "backstrap-built.js"
        },
        {
            "name": "backbone",
            "main": "backbone-built.js"
        },
        {
            "name": "bootstrap",
            "main": "bootstrap-built.js"
        },
        {
            "name": "jquery",
            "main": "jquery-built.js"
        },
        {
            "name": "jquery-ui",
            "main": "jquery-ui-built.js"
        },
        {
            "name": "underscore",
            "main": "underscore-built.js"
        },
        {
            "name": "moment",
            "main": "moment-built.js"
        }
    ],
    "shim": {
        "backstrap": {
            "deps": [
                "jquery",
                "underscore",
                "bootstrap",
                "backbone",
                "moment"
            ]
        },
        "backbone": {
            "deps": [
                "underscore"
            ],
            "exports": "Backbone"
        },
        "bootstrap": {
            "deps": [
                "jquery"
            ]
        },
        "bootstrap-default": {
            "deps": [
                "bootstrap"
            ]
        },
        "jquery-ui": {
            "deps": [
                "jquery"
            ],
            "exports": "jQuery"
        },
        "underscore": {
            "exports": "_"
        }
    },
    "baseUrl": "min/components"
};
if (typeof require !== "undefined" && require.config) {
    require.config(components);
} else {
    var require = components;
}
if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = components;
}