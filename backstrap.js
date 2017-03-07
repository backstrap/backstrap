import './backstrap/core.js';
//import './backstrap/ajaxPrefilter.js';
import './backstrap/input_event.js';
import './backstrap/dispatcher.js';
import './backstrap/Collection.js';
//import './backstrap/DragSession.js';
import './backstrap/LocalCache.js';
import './backstrap/Model.js';
//import './backstrap/PagedCollection.js';
import './backstrap/View.js';
import './backstrap/components.js';
import './backstrap/mixins.js';
import './backstrap/views.js';

define('backstrap', ['./backstrap/core.js'], function ($$) {
    return $$;
});
