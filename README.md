Backstrap
=========

**UNDER CONSTRUCTION**

**VERSION 1.0 COMING SOON!**

Need something meaty to go between the MVC backbone and the UI skin
of your client-side JavaScript app?
Look no further, you've found it: Backstrap!

Skip to...

	- [Detailed Usage](#Detailed Usage)
	- [HTML Tags](#HTML Tags)
	- [Bootstrap Tags](#Bootstrap Tags)
	- [Bootstrap Attributes](#Bootstrap Attributes)
	- [Components](#Components)

The Backstrap JavaScript library provides a layer of functionality
tying together [Bootstrap][] and [Backbone][].
If you're wondering why that's such a great idea,
take a look at this article by Christophe Coenraets:
[Sample Application with Backbone.js and Twitter Bootstrap][coenraets].

Backstrap is available on [GitHub][]
and as a Composer component on [packagist.org][packagist].
The project depends on Backbone, Bootstrap, jQuery and Underscore.
Unless you've built your own Bootstrap theme, you'll also want to
use the [bootstrap-default][] theme.
Just add 

	"components/bootstrap-theme": "~3.0"
	
to your composer.json "require".

The core Backstrap object is based heavily on
Joe Stelmach's nifty [laconic.js][laconic] package.
("Laconic simplifies the generation of DOM content.")
It also extends [Backbone-UI][] and enhances
the Backbone-UI components with Bootstrap-awareness.

To all of that we've added a natural syntax for making
basic Bootstrap-aware DOM objects,
including Bootstrap's sizing and context-coloring features;
automatic use of Bootstrap class names;
methods for making complex widgets like
grids, navbars, button-groups, forms.

Try out the [Examples Page][examples]!

In non-CommonJS environments, Backstrap defines the global namespace `$$`.
It provides a `noConflict()` method to revert the definition of `$$` if needed.

Backstrap was originally forked from
laconic commit [b7f4861a96][]
and Backbone-UI commit [ece3ea14d7][].

Sample suggested use:

	$$.div(
		$$.span({context: 'danger'},
			'Uh-oh! ',
			$$.glyph('star')
		),
		$$.button({size: 'large'}, 'OK')
	);


produces this DOM tree:

	<div>
	  <span class="text-danger">
	    Uh-oh! <span class="glyphicon glyphicon-star"></span>
	  </span>
	  <button class="btn btn-lg">OK</button>
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
[bootstrap-default]:   https://github.com/components/bootstrap-default "Bootstrap Default Theme on GitHub"
[examples]:   http://backstrap.github.io/backstrap/ "Backstrap Examples Page"
[HTML Elements]: http://www.whatwg.org/specs/web-apps/current-work/multipage/section-index.html#elements-1 "HTML Element Spec"

<a id="Detailed Usage"></a>
## Detailed usage

Backstrap adds a method to the $$ namespace for all known
[HTML Elements][].
These methods should be invoked with a variable-length list of child elements, strings, numbers, or arrays containing these types.
An optional attributes object may be passed as the first argument. 

- if you pass a "size" attribute
it will be converted into a suitable Bootstrap classname.
- if you pass a "context" or "bgcontext" attribute
it will be converted into a suitable Bootstrap classname.
- there are some new pseudo-tags, such as
`$$.badge()` to create a span with class="badge";
`$$.grid()` to create a `div` with a pre-built grid layout.
- various tags get extra decoration, for instance `$$.button()`
automatically adds the Bootstrap "btn" class to your button.
Note that this is the only supported way to build buttons -
you should avoid doing, for example, `$$.a({className: "btn"})`.
The term "label" is overloaded, since there is both an HTML label tag and
a Bootstrap label class. See the [label](#label) section below for details
on how to use labels.
- there are also constructors for building various Bootstrap.View extensions,
which allow you to make Backbone Model-bound widgets that are also
Bootstrap-enabled. For instance `$$.BasicNavbar()` which creates a navbar
whose contents are built from a description provided as a Backbone Collection.

Backstrap, like laconic, adds an `appendTo()` convenience method
to each DOM object it creates.

See the [laconic doc](http://joestelmach.github.io/laconic/)
for a description of laconic.

<a id="HTML Tags"></a>
### HTML Tags

Each HTML5 tag has a factory function in the `$$` namespace.
(Some deprecated HTML4 tags are also available.)
Some additional functions which build Bootstrap-enabled tags
have also been included.
All these methods should be invoked with a variable-length list of
child elements, strings, numbers, or arrays containing these types.
An optional attributes object may be passed as the first argument.
Most attributes get applied directly to the created object as HTML attributes;
there are a few special attributes which undergo further processing
(see [Bootstrap Attributes](#Bootstrap Attributes) below.)
For example: 

	$$.div({'class' : 'example'}, 
		$$.div('content'));

In some cases, there is a Bootstrap component name that is the same as an HTML tag name.
To work around this conflict, we make all the plain HTML tag methods accessible in the
`$$.plain` namespace.  Thus for instance in the case of "label", `$$.label()` will give you
a fully Bootstrapped `<label class="label">`,
while `$$.plain.label()` will give you a plain HTML `<label>`.
Overloaded names include: button, form, input, label, and table.

<a id="Bootstrap Tags"></a>
### Bootstrap Tags

The special Bootstrap methods are:

#### alert

The `$$.alert()` method creates a `div` tag decorated with the Bootstrap "alert" class.

#### badge

The `$$.badge()` method creates a `span` tag decorated with the Bootstrap "badge" class.

#### breadcrumb

The `$$.breadcrumb()` method creates an `ol` tag decorated with the Bootstrap "breadcrumb" class.

#### button

The `$$.button()` method creates an HTML `button` tag decorated with the Bootstrap "btn" class,
and optionally with "btn-*" classes for sizing and context.

`$$.plain.button()` gives you a bare HTML `button` tag.

#### buttonGroup

The `$$.buttonGroup()` method creates a `div` tag decorated with the Bootstrap "btn-group" class.

#### buttonToolbar

The `$$.buttonToolbar()` method creates a `div` tag decorated with the Bootstrap "btn-toolbar" class and "toolbar" role.

#### container

The `$$.container()` method creates a `div` tag decorated with the Bootstrap "container" class,
and optionally with the "container-fluid" class for fluid layout.

#### css

The `$$.css(url)` method is a shortcut for creating CSS stylesheet links.
It creates an HTML `<link rel="stylesheet" type="text/css" href="url">` tag.
Use it to load CSS from within your JS code, thus:

	$('head').append($$.css(url));

#### form

The `$$.form()` method creates a `form` tag decorated with the attribute 'role="form"'.

#### formGroup

The `$$.formGroup()` method creates a `div` tag decorated with the Bootstrap "form-group" class.
Use it to group form inputs with their labels, inside a form.

#### glyph

The `$$.glyph(name)` method creates a `span` tag decorated with the Bootstrap "glyphicon" and "glyphicon-{name}" classes.

#### grid

The `$$.grid()` method creates a nested set of divs. Pass it a "layout" attribute
in the attributes argument to format the grid. The "layout" attribute should contain
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

We also add a few convenience methods on the top-level div:
appendRows(layout), appendRow(layout), getRow(rowNum), and getCell(rowNum, colNum).
For example:

	var grid = $$.grid({layout: [ [ 6, 6 ] ]});
	grid.appendRow([ 4, 4, 4 ]);
	grid.getCell(2, 2).append('Hello World');

puts "Hello World" in the middle cell of the second row.

#### input

Creates an HTML `input` tag decorated with the Bootstrap "form-control" class,
and optionally with "input-*" classes for sizing and context.

#### inputGroup

The `$$.inputGroup()` method creates a `div` tag decorated with the Bootstrap "input-group" class.

#### inputGroupAddon

The `$$.inputGroupAddon()` method creates a `span` tag decorated with the Bootstrap "input-group-addon" class.

#### jumbotron

The `$$.jumbotron()` method creates a `div` tag decorated with the Bootstrap "jumbotron" class.

<span id="label"></span>
#### label

The term "label" is, unfortunately, overloaded. The following methods are available:

- `$$.label()` gives you an HTML `label` tag decorated with the Bootstrap "label" class.
- `$$.spanLabel()` gives you an HTML `span` tag decorated with the Bootstrap "label" class.
- `$$.plain.label()` gives you a bare HTML `label` tag.

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

#### noConflict

Provides a mechanism for reverting the definition of `$$`.
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

#### pagination

The `$$.pagination()` method creates a `ul` tag decorated with the Bootstrap "pagination" class.

#### panel

The `$$.panel()` method creates a `div` tag decorated with the Bootstrap "panel-body" class,
wrapped in a `div` decorated with the Bootstrap "panel" class.
Pass it DOM objects in either the "heading" or "footer" attributes
to embed them within a `div` with the Bootstrap "panel-heading" or "panel-footer" class.

#### pageHeader

The `$$.pageHeader()` method creates a `div` tag decorated with the Bootstrap "page-header" class.

#### thumbnail

The `$$.thumbnail()` method creates a `div` tag decorated with the Bootstrap "thumbnail" class.

#### well

The `$$.well()` method creates a `div` tag with class "well",
to make Bootstrap's simple well effect.


<span id="Bootstrap Attributes"></span>
### Bootstrap Attributes

We define a few special attributes that can be passed to
most tag factory functions, to handle certain Bootstrap formatting features.

#### bgcontext

Sets the "bg-*" background context-coloring class on the object.
Contexts defined by Bootstrap are
"default", "primary", "info", "success", "warning", and "danger".
For example:

	$$.span({bgcontext: 'warning'})

#### context

Sets the appropriate context-coloring class on the object.
"text-*", "btn-*", "label-*", etc.
Contexts defined by Bootstrap are
"default", "primary", "info", "success", "warning", and "danger".
Also "text-muted" and "btn-link".
For example:

	$$.button({context: 'info'})

#### size

Sets the appropriate Bootstrap sizing class on the object.
Supported size names are "large" or "lg", "small" or "sm", and "xs" or "extra-small".
For example:

	$$.button({size: 'large'})


<a id="Components"></a>
### Components

The tag factory functions described above give you
an easy way to build nice static content.
But here's where things get even more fun!
The Backstrap object also provides constructors for several
component classes that extend `Backbone.View`, to give you powerful
(and good-looking!) data-driven, model-bound DOM widgets,
using the power of Backbone-UI.

The components are bound to either a Backbone Model or Collection.
The components then automatically re-render when the bound model
data changes.

For efficiency, you should use the factory functions, like `$$.glyph()`,
for static graphics. Use the object constructors, like `$$.Glyph()`,
to bind a graphic object to a data model whose values may change
over the life of the page.

#### Badge

Creates a Bootstrap badge (a `span` tag with class="badge") whose content is model-bound.
Give it a Model object and the name of the property you want to use as the
badge's content.

Example:

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

Example:

	var model = new Backbone.Model({name: 'Submit'});
	var button = new $$.Button({model: model, content: 'name'}).render();
	...
	// Alter the displayed label.
	model.set('name', 'Save as Draft');

#### Calendar

Creates a month calendar diplay with the bound date value highlighted.
Clicking on a date will set the Model's date to the chosen value.

Example:

	var model = new Backbone.Model({when: new Date()});
	var cal = new $$.Calendar({model: model, content: 'when'}).render();

#### Checkbox

Creates a checkbox input.
Clicking on the checkbox will set or unset the Model's state

Example:

	var model = new Backbone.Model({state: true});
	var input = new $$.Checkbox({model: model, content: 'state'}).render();

#### Context

Creates a `span` whose Bootstrap context-color is model-bound.

A simple example - displays the text in a `span` with class "text-info":

	var model = new Backbone.Model({context: 'info'});
	var text = new $$.Context({model: model, content: 'context'}, 'This is some text').render();

Passing `background: true` makes it use the "bg-*" classes instead of "text-*".
You can also pass it a "tagName" attribute to create something other than a `span`.
The value of "content" defaults to "context".

#### DatePicker

Combines a text box input with a Calendar component.

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

#### Glyph

Creates a Bootstrap Glyphicon glyph (a `span` with class="glyphicon") whose icon is model-bound.

A simple example:

	var model = new Backbone.Model({glyph: 'star'});
	var glyph = new $$.Glyph({model: model, content: 'glyph'}).render();
	...
	// Alter the displayed icon.
	model.set('glyph', 'ok');

Glyph is also smart enough to wrap your glyphicon in an outer `span`
in order to properly implement "size" and "context" attributes.

	var glyph = new $$.Glyph({content: 'star', size: 'large', context: 'danger'}).render();

Gives you a large red star (note that you can pass a literal value directly to content
instead of supplying a model object and property name.)

#### Label

Creates a Bootstrap label (a `label` tag with class="label") whose label text is model-bound.
You can pass "context" and "size" attributes to define
the corresponding Bootstrap "btn-*" classNames.

#### Link

Creates a URL link (an `a` tag) whose label text is model-bound.
You can pass "context" and "size" attributes to define
the corresponding Bootstrap "btn-*" classNames.

#### List

Creates a simple list display of a Collection.

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
	}).render();

altValueContent defaults to altLabelContent.

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

#### TextArea

A model-bound textarea.

Example:

	new $$.TextArea({
		model: new Bakcbone.Model({ description: 'some text' }),
		content: 'description'
	}).render();

#### TextField

A model-bound text input.

Example:

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

Example:

	new $$.TimePicker({
		name: 'startTime',
		interval: 15,
		format: 'hh:mm a',
		model: new Backbone.Model({ when: new Date() }),
		content: 'when'
	}).render();
