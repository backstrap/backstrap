/**
 * Model-bound Mobiscroll widget.
 *
 * options should look like this:
 * {
 *     model: new $$.Model(),
 *     content: 'fieldName',
 *     mobiscroll: { < mobiscroll options > }
 * }
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 * 
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var refresh = function() {
            var newValue = this.resolveContent();
            if (this.$el.mobiscroll('getValue') !== newValue) {
                this.$el.mobiscroll('setValue', _(newValue).exists() ? newValue : '');
            }
        };

        var onSelect = function (value, inst) {
            _(this.model).setProperty(this.options.content, this.$el.mobiscroll('getValue'));
            if (this.options.mobiscroll.onSelect) {
                this.options.mobiscroll.onSelect(value, inst);
            }
        };

        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            tagName: 'input',
            className: 'mobiscroll form-control form-control-default',
    
            initialize : function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this._observeModel(_.bind(refresh, this));
            },
    
            render : function () {
                var that = this;
                var defaultText = 'Number';
                var values = [];
                var inputOpts = _.extend(
                    // defaults
                    {
                        theme: 'mobiscroll',
                        numberText: defaultText,
                        min: 0,
                        max: 100,
                        step: 1
                    },
                    this.options.mobiscroll ? this.options.mobiscroll : { },
                    // overrides
                    {
                        onSelect: _.bind(onSelect, this),
                        formatResult: function(data) {
                            return data.join();
                        },
                        parseValue: function(value) {
                            return [ value ];
                        },
                        validate: function (dw, i, time) {
                           var t = $('.dw-ul', dw);
                           $.each(that.options.mobiscroll.invalid, function (i, v) {
                               $('.dw-li[data-val="' + v + '"]', t).removeClass('dw-v');
                           });
                        }
                    }
                );

                for (var value = inputOpts.min; value <= inputOpts.max; value += inputOpts.step) {
                    values.push(value);
                }

                inputOpts.wheels = inputOpts.wheels ? inputOpts.wheels :
                    [ [ {
                        values: values,
                        label: inputOpts.numberText
                    } ] ];

                this.$el.mobiscroll(inputOpts);
                this.$el.mobiscroll('setValue', this.resolveContent(), true);

                return this;
            },
            
            mobiscroll: function () {
                this.$el.mobiscroll(arguments);
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/views/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
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
}(this, 'NumberField', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
