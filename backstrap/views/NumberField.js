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
define(
    "backstrap/views/NumberField",
    [
        "../core", "jquery", "underscore", "../View", "../mixins/HasModel"
    ], function ($$, $, _)
{
    var refresh = function() {
        var newValue = this.resolveContent();
        if (this.$el.mobiscroll('getVal') !== newValue) {
            this.$el.mobiscroll('setVal', _(newValue).exists() ? newValue : '', true);
        }
    };

    var onSelect = function (value, inst) {
        this.model.set(this.options.content, this.$el.mobiscroll('getVal'));
        if (this.options.mobiscroll && this.options.mobiscroll.onSelect) {
            this.options.mobiscroll.onSelect(value, inst);
        }
    };

    return ($$.NumberField = $$.views.NumberField = $$.View.extend({
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
});
