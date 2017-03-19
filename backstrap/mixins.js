define(
    [
        './core',
        './mixins/HasAlternativeProperty',
        './mixins/HasError',
        './mixins/HasFocus',
        './mixins/HasFormLabel',
        './mixins/HasGlyph',
        './mixins/HasModel'
    ],
    function ($$)
    {
        return $$.mixins;
    }
);
