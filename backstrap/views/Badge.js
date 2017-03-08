/**
 * A model-bound Bootstrap badge object.
 *
 * Use model and content options to set the content of the badge.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Badge", ["../core", "underscore", "../View", "../mixins/HasModel"], function ($$, _)
{
    return ($$.Badge = $$.views.Badge = $$.View.extend({
        tagName: 'span',

        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel]);
            _(this).bindAll('render');
            this.$el.addClass('badge');
        },

        render : function() {
            var content = this.resolveContent();
            this._observeModel(this.render);
            this.$el.text(content);
            return this;
        }
    }));
});
