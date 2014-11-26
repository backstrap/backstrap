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
 * NumberField-specific mobiscroll options are:
 * min, max, step and invalid (an array of values to be considered invalid).
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
            if (this.$el.mobiscroll('getVal') !== newValue) {
                this.$el.mobiscroll('setVal', _(newValue).exists() ? newValue : '', true);
            }
        };

        var onSelect = function (value, inst) {
            this.model.set(this.options.content, this.$el.mobiscroll('getVal'));
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
                        step: 1,
                        invalid: []
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
                this.$el.mobiscroll('setVal', this.resolveContent(), true);

                return this;
            },
            
            mobiscroll: function () {
                var result = this.$el.mobiscroll.apply(this.$el, arguments);
                return (result === this.$el) ? this : result;
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
