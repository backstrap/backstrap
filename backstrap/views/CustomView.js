/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * This also defines several subclasses of the generic Tag class,
 * which implement particular common tags.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/CustomView',
    ['../core', 'underscore', '../View'],
    function ($$, _) {
        return ($$.CustomView = $$.views.CustomView = $$.View.extend({
            initDOM: _.noop,

            initialize: function () {
                $$.View.prototype.initialize.apply(this, arguments);
                this.mixin([$$.mixins.HasModel]);
                this.initInstanceDOM = _.once(_.bind(this.initDOM, this));
            },

            render: function () {
                $$.View.prototype.render.call(this);
                this.initInstanceDOM();
                return this;
            }
        }));
    }
);
