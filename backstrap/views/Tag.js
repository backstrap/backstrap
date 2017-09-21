/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Tag',
    ['../core', 'underscore', './ContentView'],
    function ($$, _) {
        return ($$.Tag = $$.views.Tag = $$.ContentView.extend({
            options: _.extend({}, $$.ContentView.prototype.options, {
                context: 'default',
            }),

            render: function () {
                var content = this.resolveContent();

                if (_.isString(content)) {
                    content = document.createTextNode(content);
                }

                this.$el.empty().append(content);
                this._observeModel(_.bind(this.render, this));

                return this;
            }
        }));
    }
);
