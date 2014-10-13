/**
 * This is a bit of a kluge.  We need to differentiate between
 * the case where we're loading from the Composer component-builder
 * components/backstrap/backstrap-built.js (which has an AMD define()
 * function defined) and the case where we're loading individual files
 * on demand via some other AMD loader.  So we set a temporary global function,
 * _$$_backstrap_built_flag, for the duration of backstrap-built.js.
 * We test for its existence within the module scripts, and then at the end
 * (see _cleanup.js), we execute the _$$_backstrap_built_flag function
 * causing it to remove itself from our global context.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function (context)
{
	if (typeof context.define === "function" && context.define.amd) {
		var saved = context._$$_backstrap_built_flag;
		context._$$_backstrap_built_flag = function _built_flag() {
			if ( context._$$_backstrap_built_flag === _built_flag ) { context._$$_backstrap_built_flag = saved; }
		};
	}
}(this));
