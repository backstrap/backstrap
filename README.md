Backstrap
=========

Are you looking for something meaty to connect
the MVC backbone and the UI skin
of your client-side JavaScript app?
Look no further, you've found it:
**Backstrap!**

The Backstrap JavaScript library provides a layer of functionality
tying together [Bootstrap][] and [Backbone][].
It makes it easy to lay out a clean, well-designed user interface
with interface components that are tightly bound to data model objects
backed by a powerful model-view-control application framework.
If you're wondering why that's such a great idea,
take a look at this popular article by Christophe Coenraets:
[Sample Application with Backbone.js and Twitter Bootstrap][coenraets].

Skip to...

- [HTML Tags](#html-tags)
- [Bootstrap Tags](#bootstrap-tags)
- [Bootstrap Attributes](#bootstrap-attributes)
- [Components](#components)
- [Backbone Extensions](#backbone-extensions)
- [noConflict](#noconflict)

Backstrap is available on [GitHub][]
and as a Composer component on [Packagist][packagist].
The project depends on Backbone, Bootstrap, jQuery and Underscore.
Unless you've built your own Bootstrap theme, you'll also want to
use the [bootstrap-default][bsdefault] theme.
With Composer, just add 

	"backstrap/backstrap": ">0.1",
	"components/bootstrap-theme": "~3.0"
	
to your composer.json "require" to get started.

The core Backstrap object is based heavily on
Joe Stelmach's nifty [laconic.js][laconic] package,
which simplifies the generation of DOM content,
and on [Backbone-UI][] which provides a set of
higher-level data-bound components.

To all of that we've added generators for
Bootstrap-enhanced DOM objects and data-bound components,
easy support for Bootstrap's sizing and context-coloring features;
and methods for making complex Bootstrap components like
grids, navbars, button-groups, forms.

Try out the [Examples Page][examples]!

Also see an example of a ["No-HTML" web page][nohtml].

Backstrap follows the RequireJS loading protocol. To use it...

    require(["backstrap"], function ($$) {
        ... 
    });

Sample suggested usage:

	$$.div(
		$$.span({context: 'danger'},
			'Hello, star! ',
			$$.glyph('star')
		),
		$$.button({size: 'large'}, 'OK')
	);

produces this DOM tree:

	<div>
	  <span class="text-danger">
	    Hello, star!
	    <span class="glyphicon glyphicon-star"></span>
	  </span>
	  <button type="button" class="btn btn-lg">OK</button>
	</div>

[bootstrap]:   http://getbootstrap.com/ "Bootstrap Homepage"
[backbone]:    http://backbonejs.org/ "Backbonejs Homepage"
[coenraets]:   http://coenraets.org/blog/2013/04/sample-application-with-backbone-js-and-twitter-bootstrap-updated-and-improved/ "Christophe Coenraets Blog"
[github]:      https://github.com/backstrap/backstrap "Backstrap on GitHub"
[packagist]:   https://packagist.org/packages/backstrap/backstrap "Backstrap on Packagist"
[laconic]:     https://github.com/joestelmach/laconic "Laconic on GitHub"
[lacLicense]:  https://github.com/joestelmach/laconic/blob/master/LICENSE "Laconic License"
[backbone-ui]: https://github.com/perka/backbone-ui "Backbone-UI on GitHub"
[bbuiLicense]: https://github.com/perka/backbone-ui/blob/master/LICENSE "Backbone-UI License"
[b7f4861a96]:  https://github.com/joestelmach/laconic/commit/b7f4861a96153c213569ac8aa537e94312c71ce8
[ece3ea14d7]:  https://github.com/perka/backbone-ui/commit/ece3ea14d71bf1bc8f8a0ce01103d74bfe29a10f
[bsdefault]:   https://github.com/components/bootstrap-default "Bootstrap Default Theme on GitHub"
[examples]:    http://backstrap.github.io/backstrap/examples.html "Backstrap Examples Page"
[nohtml]:      http://backstrap.github.io/backstrap/nohtml.html "Backstrap No-HTML Example"
[elementspec]: http://www.whatwg.org/specs/web-apps/current-work/multipage/section-index.html#elements-1 "HTML Element Spec"

## Detailed usage

### HTML Tags

Backstrap adds a method to the $$ namespace for each known
[HTML Element][elementspec].
These methods should be invoked with a variable-length list of child elements, strings, numbers, or arrays containing these types.
An optional attributes object may be passed as the first argument.
For example:

	$$.div({className: 'example'},
		$$.p('content')
	);

produces

	<div class="example">
		<p>content</p>
	</div>

Various HTML tags get extra Bootstrap decoration by default,
for instance `$$.button()` automatically adds the Bootstrap "btn" class to your button.
Note that this is the only supported way to build buttons -
you should avoid using, for example, `$$.a({className: "btn"})`.

Most attributes get applied directly to the created object as HTML attributes;
there are a few special attributes which undergo further processing.
For instance, if you pass a "size" or "context" attribute
it will be converted into a suitable Bootstrap classname.
See [Bootstrap Attributes](#bootstrap-attributes) below for more details.
Also, if you include an "aria" attribute with an object as its value,
this will get translated to a set of
[ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes.
For example:
    
    $$.div({aria: {label: 'My Label', required: 'true'}})`.

produces

    <div aria-label="My Label" aria-required="true"></div>

Backstrap, like laconic, adds an `appendTo()` convenience method
to each DOM object it creates.
See the [laconic doc](http://joestelmach.github.io/laconic/)
for a description of laconic.

Some additional methods which build more complex, Bootstrap-enabled tag sets have also been included,
for instance `$$.grid()`. These are described in the next section, [Bootstrap Tags](bootstrap-tags).

In some cases, there is a Bootstrap component name that is the same as an HTML tag name.
To work around this conflict, we make all the plain HTML tag methods accessible in the
`$$.plain` namespace.  Thus for instance in the case of "label", `$$.label()` will give you
a fully Bootstrapped `<label class="label">`,
while `$$.plain.label()` will give you a plain HTML `<label>`.
Overloaded names include: button, form, input, label, and table. For example:

	$$.div(
		$$.plain.button('Click me!'),
		$$.button({size: 'large'}, 'No, click me!')
	);

produces:

	<div>
		<button>Click me!</button>
		<button type="button" class="btn btn-lg">No, click me!</button>
	</div>

There are also constructors for building various Bootstrap.View extensions,
which allow you to make Backbone Model-bound components that are also
Bootstrap-enabled. For instance `$$.BasicNavbar()` which creates a navbar
whose contents are built from a description provided as a Backbone Collection.
See [Components](#components) below for more details.

### Bootstrap Tags

The Bootstrap-enabled DOM generator methods are:

#### alert

The `$$.alert()` method creates a `div` tag decorated with the Bootstrap "alert" class.

#### badge

The `$$.badge()` method creates a `span` tag decorated with the Bootstrap "badge" class.

#### breadcrumb

The `$$.breadcrumb()` method creates an `ol` tag decorated with the Bootstrap "breadcrumb" class.

#### button

The `$$.button()` method creates a `button` tag decorated with the Bootstrap "btn" class,
and optionally with "btn-*" classes for sizing and context.
It also sets the button's "type" attribute to "button".
There are special methods for creating buttons with type=submit or type=reset.

`$$.plain.button()` gives you a bare `button` tag.
(Note that you should always set the type attribute of a button!)

#### buttonGroup

The `$$.buttonGroup()` method creates a `div` tag decorated with the Bootstrap "btn-group" class.

#### buttonToolbar

The `$$.buttonToolbar()` method creates a `div` tag decorated with the Bootstrap "btn-toolbar" class
and also the attribute 'role="toolbar"'.

#### container

The `$$.container()` method creates a `div` tag decorated with the Bootstrap "container" class,
and optionally with the "container-fluid" class for fluid layout.

#### css

The `$$.css(url)` method is a shortcut for creating CSS stylesheet links.
It creates an HTML `<link rel="stylesheet" type="text/css" href="url">` tag.
Use it to load CSS from within your JS code.
For example:

	$('head').append($$.css('/css/myStyles.css'));

#### form

The `$$.form()` method creates a `form` tag decorated with the attribute 'role="form"'.

#### formGroup

The `$$.formGroup()` method creates a `div` tag decorated with the Bootstrap "form-group" class.
Use it to group form inputs with their labels, inside a form.

#### glyph

The `$$.glyph(name)` method creates an empty `span` tag decorated with the Bootstrap "glyphicon" and "glyphicon-{name}" classes.
For example:

	$$.glyph('star');

#### grid

The `$$.grid()` method creates a nested set of divs. Pass it a "layout" attribute
in the attributes argument to define the grid cells. The "layout" attribute should contain
an array of arrays of cell specifications. Each cell specification can be either
a simple integer specifying the width (in columns) of the cell, or an object
with properties for each device-size for which you want to set a column width.
Use either Bootstrap's short names ("lg", "sm") or full names ("large", "small").
It may also contain a "content" property containing a DOM object to use as
the contents of the cell. For example:

	$$.grid({layout: [
		[ 6, 6 ],
		[ { xs: 12, md: 6, content: $$.div('Hello, World') } ]
	]});

Pass grid a "fluid: true" attribute to get a fluid layout (using Bootstrap's
"container-fluid" class instead of "container" on the top-level div).
See [Bootstrap's grid doc](http://getbootstrap.com/css/#grid) for more info on using Bootstrap grids.

We also add a few convenience methods on the top-level div:
appendRows(layout), appendRow(layout), getRow(rowNum), and getCell(rowNum, colNum).
For example:

	var grid = $$.grid({layout: [ [ 6, 6 ] ]});
	grid.appendRow([ 4, 4, 4 ]);
	grid.getCell(2, 2).append('Hello World');

puts "Hello World" in the middle cell of the second row.

#### input

Creates an `input` tag decorated with the Bootstrap "form-control" class,
and optionally with "input-*" classes for sizing and context.

#### inputGroup

The `$$.inputGroup()` method creates a `div` tag decorated with the Bootstrap "input-group" class.

#### inputGroupAddon

The `$$.inputGroupAddon()` method creates a `span` tag decorated with the Bootstrap "input-group-addon" class.

#### jumbotron

The `$$.jumbotron()` method creates a `div` tag decorated with the Bootstrap "jumbotron" class.

<span id="label"></span>
#### label

The `$$.label()` method creates a `label` tag decorated with the Bootstrap "label" class,
and optionally with "label-*" classes for sizing and context.

`$$.plain.label()` gives you a bare `label` tag.

See also [spanlabel](#spanlabel).

#### linkList

The `$$.linkList()` method creates a `div` tag decorated with the Bootstrap "list-group" class,
to implement a Bootstrap "linked item list group".
It should be populated with `$$.linkListItem()'s`.

#### linkListItem

The `$$.linkListItem()` method creates an `a` tag decorated with the Bootstrap "list-group-item" class.
It should be used with `$$.linkList()`.

#### list

The `$$.list()` method creates a `ul` tag decorated with the Bootstrap "list-group" class,
to implement a Bootstrap "list group".
It should be populated with `$$.listItem()'s`.

#### listItem

The `$$.listItem()` method creates an `li` tag decorated with the Bootstrap "list-group-item" class.
It should be used with `$$.list()`.

#### media

The `$$.media()` method creates a `div` tag decorated with the Bootstrap "media" class.
Passit a DOM object as its "media" attribute, and an optional 'pull: "right"'
if you want it pulled right instead of left.
Its body will be further wrapped in a div with class "media-body".

#### pagination

The `$$.pagination()` method creates a `ul` tag decorated with the Bootstrap "pagination" class.

#### panel

The `$$.panel()` method creates a `div` tag decorated with the Bootstrap "panel-body" class,
wrapped in a `div` decorated with the Bootstrap "panel" class.
Pass it DOM objects in either the "heading" or "footer" attributes
to embed them within a `div` with the Bootstrap "panel-heading" or "panel-footer" class.

#### pageHeader

The `$$.pageHeader()` method creates a `div` tag decorated with the Bootstrap "page-header" class.

#### resetButton

The `$$.resetButton()` method creates a `button` tag decorated with the Bootstrap "btn" class,
and optionally with "btn-*" classes for sizing and context.
It also sets the button's "type" attribute to "reset".

#### submitButton

The `$$.submitButton()` method creates a `button` tag decorated with the Bootstrap "btn" class,
and optionally with "btn-*" classes for sizing and context.
It also sets the button's "type" attribute to "submit".

#### spanlabel

The `$$.spanlabel()` method creates a `span` tag decorated with the Bootstrap "label" class,
and optionally with "label-*" classes for sizing and context.

#### thumbnail

The `$$.thumbnail()` method creates a `div` tag decorated with the Bootstrap "thumbnail" class.

#### well

The `$$.well()` method creates a `div` tag with class "well",
to make Bootstrap's simple well effect.


<span id="bootstrap-attributes"></span>
### Bootstrap Attributes

We define a few special attributes that can be passed to
most tag factory functions, to handle certain Bootstrap formatting features.

#### bgcontext

Sets the "bg-*" background context-coloring class on the object.
Contexts defined by Bootstrap are
"default", "primary", "info", "success", "warning", and "danger".
For example:

	$$.span({bgcontext: 'warning'})

will create a span with class "bg-warning".

#### context

Sets the appropriate context-coloring class on the object.
"text-*", "btn-*", "label-*", etc.
Contexts defined by Bootstrap are
"default", "primary", "info", "success", "warning", and "danger".
Also "text-muted" and "btn-link".
For example:

	$$.button({context: 'info'})

will create a button with class "btn btn-info".

#### size

Sets the appropriate Bootstrap sizing class on the object.
Supported size names are "large" or "lg", "default" (the default),
"small" or "sm", and "xs" or "extra-small".
For example:

	$$.button({size: 'large'})

will create a button with class "btn btn-lg".

### Components

The tag factory functions described above give you
an easy way to build nice static content.
But here's where things get even more fun!
The Backstrap object also provides constructors for several
component classes that extend `Backbone.View`, to give you powerful
(and good-looking!) data-driven, model-bound DOM components.

The components are bound to either a Backbone Model or Collection.
The components then automatically re-render when the bound model
data changes.

For efficiency, you should use the factory functions, like `$$.button()`,
for static graphics. Use the object constructors, like `$$.Button()`,
to bind a graphic object to a data model whose value may change
over the life of the page.

#### Badge

Creates a Bootstrap badge (a `span` tag with class="badge") whose content is model-bound.
Give it a Model object and the name of the property you want to use as the
badge's content.
For example:

	var model = new Backbone.Model({item: 'tweets', count: 42});
	var badge = new $$.Badge({model: model, content: 'count'}).render();

#### BasicNavbar

Creates a Bootstrap navbar whose buttons are model-bound.
By default, it will create a simple button for each element of the
provided Collection, using the model object's name, href, and label properties.
For example:

	var items = new Backbone.Collection([
		{name: 'view', label: 'View', href: '#view'},
		{name: 'edit', label: 'Edit', href: '#edit'},
		{name: 'delete', label: 'Delete', href: '#delete'}
	]);
	var navbar = new $$.BasicNavbar({brand: 'My App', model: items}).render();

creates a navbar with three buttons.

#### Button

Creates a Bootstrap button (a `button` tag with class="btn") whose label is model-bound.
You can pass "context" and "size" attributes to define
the corresponding Bootstrap "btn-*" classNames.
For example:

	var model = new Backbone.Model({name: 'Submit'});
	var button = new $$.Button({model: model, content: 'name'}).render();
	...
	// Alter the displayed label.
	model.set('name', 'Save as Draft');

#### Calendar

Creates a month calendar diplay with the bound date value highlighted.
Clicking on a date will set the Model's date to the chosen value.
For example:

	var model = new Backbone.Model({when: new Date()});
	var cal = new $$.Calendar({model: model, content: 'when'}).render();

#### Checkbox

Creates a checkbox input.
Clicking on the checkbox will set or unset the Model's state
For example:

	var model = new Backbone.Model({state: true});
	var input = new $$.Checkbox({model: model, content: 'state'}).render();

#### CollectionView

A generic Collection-aware view. Listens to add, remove, and change events on the Collection,
and provides a basic rendering framework. Example:

	new $$.CollectionView({
		model: someCollection,
		itemView: $$.View.extend({ /* view for individual item */ }),
		emptyContent: 'No items to show',
		placeItem: function (itemview) {
			// If you require special handling to place itemViews on the page.
		},
		placeEmpty: function (emptycontent) {
			// If you require special handling to place emptyContent on the page.
		}
	});
	
Both $$.List and $$.Table extend this component.

#### Container

Creates a Backbone View whose DOM is a `div` decorated with the Bootstrap "container" class.

#### Context

Creates a `span` whose Bootstrap context-color is model-bound.

A simple example - displays the text in a `span` with class "text-info":

	var model = new Backbone.Model({context: 'info'});
	var text = new $$.Context({
			model: model,
			content: 'context'
		}, 'This is some text').render();

Passing `background: true` makes it use the "bg-\*" classes instead of "text-\*".
You can also pass it a "tagName" attribute to create something other than a `span`.
The value of "content" defaults to "context".

#### DatePicker

Combines a text box input with a [Calendar](#calendar) component.

#### Div

Creates a Backbone View whose DOM is a simple unadorned `div`.

#### Dropdown

Creates a Bootstrap dropdown menu whose buttons are model-bound.
By default, it will create a simple button for each element of the
provided Collection, using the model object's label and href properties.
Also supports header and divider elements.
For example:

	var items = new Backbone.Collection([
		{header: true, label: 'Operations'},
		{label: 'View', href: '#view'},
		{label: 'Edit', href: '#edit'},
		{divider: true},
		{label: 'Delete', href: '#delete'}
	]);
	var dropdown = new $$.Dropdown({buttonLabel: 'File', model: items}).render();

creates a dropdown with a header and three buttons; the last button is below a divider.
You can also use a "separator" property - "separator" is a synonym for "divider".

#### FileInput

Creates an input with type="file".  
You can pass various attributes that support file input functionality:
"name" is used for tboth the name and id of the input;
"disabled" will disable the input;
"multiple" will allow multiple file selection;
"maxSize" limits the allowed size of the file;
"typeMatch" and "nameMatch" can be used to filter the files available for selection.

#### Glyph

Creates a Bootstrap Glyphicon glyph (a `span` with class="glyphicon") whose icon is model-bound.
For example:

	var model = new Backbone.Model({glyph: 'star'});
	var glyph = new $$.Glyph({
		model: model,
		content: 'glyph'
	}).render();
	...
	// Alter the displayed icon.
	model.set('glyph', 'ok');

Glyph is also smart enough to wrap your glyphicon in an outer `span`
in order to properly implement "size" and "context" attributes.

	var glyph = new $$.Glyph({content: 'star', size: 'large', context: 'danger'}).render();

Gives you a large red star (note that you can pass a literal value directly to content
instead of supplying a model object and property name.)

#### Grid

Creates a Bootstrap grid layout (a `div` tag with class="container", containing "row" and "col" `div's`) as a Backbone View.
Pass it a "layout" attribute in the attributes argument to define the grid cells.
The "layout" attribute should contain an array of arrays of cell specifications.
Each cell specification can be either a simple integer specifying the width (in columns) of the cell,
or an object with properties for each device-size for which you want to set a column width.
Use either Bootstrap's short names ("lg", "sm") or full names ("large", "small").
It may also contain a "content" property containing a DOM object to use as
the contents of the cell. For example:

	$$.Grid({layout: [
		[ 6, 6 ],
		[ { xs: 12, md: 6, content: $$.div('Hello, World') } ]
	]});

Pass Grid a "fluid: true" attribute to get a fluid layout (using Bootstrap's
"container-fluid" class instead of "container" on the top-level div).
See [Bootstrap's grid doc](http://getbootstrap.com/css/#grid) for more info on using Bootstrap grids.

#### Label

Creates a Bootstrap label (a `label` tag with class="label") whose label text is model-bound.
You can pass "context" and "size" attributes to define
the corresponding Bootstrap "label-*" classNames.

#### Link

Creates a URL link (an `a` tag) whose label text is model-bound.
You can pass "context" and "size" attributes to define
the corresponding Bootstrap "link-*" classNames.

#### List

Creates a simple list display of a Collection.
For example:

	var list = new $$.List({
		model: new Backbone.Collection({
			{ id: 1, name: 'Alaska' },
			{ id: 2, name: 'Maine' },
			{ id: 3, name: 'Florida' },
			{ id: 4, name: 'Nevada' }
		}),
		content: 'name'
	});

#### Menu

Creates a scrolling menu list whose value is taken from the bound Model
and whose choices are taken from the bound Collection of alternatives.
For example:

	var menu = new $$.Menu({
		model: new Backbone.Model({place: 'Alaska'}),
		content: 'place',
		alternatives: new Backbone.Collection({
			{ id: 1, name: 'Alaska' },
			{ id: 2, name: 'Maine' },
			{ id: 3, name: 'Florida' },
			{ id: 4, name: 'Nevada' }
		}),
		altLabelContent: 'name',
		altValueContent: 'id'
	});

altValueContent defaults to altLabelContent.

#### ModelView

A generic Model-aware view. Listens to change events on the Model,
which cause it to re-render itself.

#### NavPills

Creates a Bootstrap "pills" nav whose buttons are model-bound.
By default, it will create a simple button for each element of the
provided Collection, using the model object's name, href, and label properties.
For example:

	var items = new Backbone.Collection([
		{name: 'view', label: 'View', href: '#view'},
		{name: 'edit', label: 'Edit', href: '#edit'},
		{name: 'delete', label: 'Delete', href: '#delete'}
	]);
	var pills = new $$.NavPills({model: items}).render();

creates a set of three pills.

#### NavTabs

Creates a Bootstrap "tabs" nav whose buttons are model-bound.
By default, it will create a simple button for each element of the
provided Collection, using the model object's name, href, and label properties.
For example:

	var items = new Backbone.Collection([
		{name: 'view', label: 'View', href: '#view'},
		{name: 'edit', label: 'Edit', href: '#edit'},
		{name: 'delete', label: 'Delete', href: '#delete'}
	]);
	var tabs = new $$.NavTabs({model: items}).render();

creates a set of three tabs.

#### Panel

Creates a Backbone View whose DOM is a `div` decorated with the Bootstrap "panel" class.

#### ProgressBar

ProgressBar creates a Bootstrap "progress" div, with model-bound progress bar(s).
"Model" property can be either a BackBone Model (for a single progress bar)
or a BackBone.Collection for (multiple stacked progress bars).
Model objects may contain context, min, max, labelled, and labelSuffix properties,
in addition to a content property which should be numeric.
Min and max default to 0 and 100; labelled defaults to false.

#### RadioGroup

Creates a group of radio buttons whose value is taken from the bound Model
and whose choices are taken from the bound Collection of alternatives.
For example:

	var menu = new $$.RadioGroup({
		model: new Backbone.Model({place: 'Alaska'}),
		content: 'place',
		alternatives: new Backbone.Collection({
			{ id: 1, name: 'Alaska' },
			{ id: 2, name: 'Maine' },
			{ id: 3, name: 'Florida' },
			{ id: 4, name: 'Nevada' }
		}),
		altLabelContent: 'name',
		altValueContent: 'id'
	}).render();

altValueContent defaults to altLabelContent.

#### Select

Creates a Backbone View whose DOM is a `select` tag.

#### Span

Creates a Backbone View whose DOM is a simple unadorned `span`.

#### StaticField

Creates a Backbone View whose DOM is a simple read-only input field.

#### Table

The Backbone-UI TableView, decorated with Bootstrap classes.
Pass attributes to set the various table options available in Bootstrap:
	new Table({
		striped: true,
		bordered: true,
		hover: true,
		condensed: true,
		responsive: true
	});

will give you a zebra-striped, bordered, condensed,
responsive table with hover highlighting.

The "columns" parameter allows you to describe each column,
including title, content, width, className and headingClassName properties
(the column's heading cell will use className if headingClassName is not specified.)


#### TextArea

A model-bound textarea.
For example:

	new $$.TextArea({
		model: new Bakcbone.Model({ description: 'some text' }),
		content: 'description'
	}).render();

#### TextField

A model-bound text input.
For example:

	new $$.TextField({
		model: new Bakcbone.Model({ description: 'some text' }),
		content: 'description'
	}).render();

#### TimePicker

A text area with a dropdown list of times.
Defaults to allowing choices in half-hour increments,
which can be changed by setting the 'interval' option (in minutes).
'Name' is the HTML name attribute for the form item.
Format defaults to 'hh:mm a'.
For example:

	new $$.TimePicker({
		name: 'startTime',
		interval: 15,
		format: 'hh:mm a',
		model: new Backbone.Model({ when: new Date() }),
		content: 'when'
	}).render();

### Backbone Extensions

Backstrap has objects for virtually all of the Backbone objects you'll need, too.

#### Events

$$.Events is a simple extension of Backbone.Events.

#### Model

$$.Model extends Backbone.Model and adds an autoRefresh option.
If autoRefresh is true, the Backstrap dispatcher will call model.fetch()
on a regular basis to refresh the model data from the server.
The interval is tunable (see [dispatcher](#dispatcher)), and can be
configured to slow down over time.

#### Collection

$$.Collection extends Backbone.Collection and adds an autoRefresh option.
If autoRefresh is true, the Backstrap dispatcher will call collection.fetch()
on a regular basis to refresh the model data from the server.
The interval is tunable (see [dispatcher](#dispatcher)), and can be
configured to slow down over time.

#### View

$$.View is a simple extension of Backbone.View.

#### Router

$$.Router is a simple extension of Backbone.Router.

#### history

$$.history is an alias for Backbone.history.

#### dispatcher

$$.dispatcher is an Events object which provides the autoRefresh functionality
for Models and Collections. Tunable parameters are 
  - minInterval The base interval between refreshes (in seconds)
  - maxInterval The maximum interval between refreshes, after decay (in seconds)
  - decayFrequency How many refreshes to do at a particular interval before increasing the interval
  - decayFactor How much to increase the interval by, when decaying

### noConflict

The `$$.noConflict()` method provides a mechanism for reverting the definition of `$$`.
Backstrap will attempt to register itself as a CommonJS module.
But when that functionality is not available
it defines the global `$$` instead.
It is possible that your app would want to include
some other package that also uses the global `$$`.
In this case, load the Backstrap package after the other package;
you can then use `$$.noConflict()` to define some other variable
to hold the Backstrap object,
and revert the definition of `$$` back to the other package.
For example:

	var Backstrap = $$.noConflict();

Now `$$` is whatever it was before you loaded Backstrap,
and you can use the variable `Backstrap` to access the Backstrap methods.
You might want to pick a shorter variable name, like `$b`.
