define(
    ['underscore', 'jquery', './core'],
    function (_, $, $$)
    {
        /*
         * A filter that supports the use of HTTP If-Modified headers
         * for streamlining management of Collection data.
         */
        var ifModifiedFilter = function ifModifiedFilter(options, originalOptions, jqXHR) {
            if (options.ifModified && options.collection) {
                var success = options.success;

                options.success = function (resp, status, xhr) {
                    if (status === 'notmodified' && success) {
                        // Assume unchanged - re-use current data.
                        resp = JSON.stringify(options.collection.models);
                        success(resp, status, xhr);
                    }
                };
            }
        };

        if (!$$.ajaxCallbacks) {
            $$.ajaxCallbacks = new $.Callbacks('unique');
            $.ajaxPrefilter(_.bind($$.ajaxCallbacks.fire, $$.ajaxCallbacks));
        }

        $$.ajaxCallbacks.add(ifModifiedFilter);

        return {
            on: function () {
                $$.ajaxCallbacks.add(ifModifiedFilter);
            },
            off: function () {
                $$.ajaxCallbacks.remove(ifModifiedFilter);
            }
        };
    }
);
