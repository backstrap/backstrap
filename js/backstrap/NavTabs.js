/**
 * A model-bound Bootstrap tabs nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements) {
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: 'a',
            className: 'nav-item',
            
            render: function render() {
                this.$el.addClass('nav-item-' + this.model.get('name'))
                    .attr('href', this.model.get('href'))
                    .text(this.model.get('label'));
                return this;
            }
        });
        
        return ($$[moduleName] = $$.List.extend({
    
            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);
            },
    
            render: function () {
                $$.List.prototype.render.call(this);
                this.$('> ul').addClass('nav nav-tabs');
                return this;
            }
        }));
    };

    if (typeof context.define === 'function' && context.define.amd
            && !context._$$_backstrap_built_flag) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
            && typeof context.module.exports === 'object') {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'NavTabs', [ 'backstrap', 'backstrap/List' ]));

