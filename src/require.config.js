var components = {
    "packages": [
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
            "name": "underscore",
            "main": "underscore-built.js"
        },
        {
            "name": "moment",
            "main": "moment-built.js"
        },
        {
            "name": "backstrap",
            "main": "backstrap-built.js"
        }
    ],
    "shim": {
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
        "underscore": {
            "exports": "_"
        },
        "bootstrap-default": {
            "deps": [
                "bootstrap"
            ]
        },
        "backstrap": {
            "deps": [
                "jquery",
                "underscore",
                "bootstrap",
                "backbone",
                "moment"
            ]
        }
    },
    "baseUrl": "components",
    "noGlobal": false
};
if (typeof require !== "undefined" && require.config) {
    require.config(components);
} else {
    var require = components;
}
if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = components;
}