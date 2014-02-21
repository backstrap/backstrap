Backstrap
=========

**UNDER CONSTRUCTION. VERSION 1.0 COMING SOON!**

Need something meaty to go between the backbone of your client-side JS app
and its UI skin? Look no further, you've found it: Backstrap!

The Backstrap JavaScript library provides a layer of functionality
tying together [Bootstrap][] and [Backbone][].
If you're wondering why that's such a great idea,
take a look at this article by Christophe Coenraets:
[Sample Application with Backbone.js and Twitter Bootstrap][coenraets].

Backstrap is available on [GitHub][]
and as a Composer component on [packagist.org][packagist].

The core Backstrap object is based heavily on
Joe Stelmach's nifty [laconic.js][laconic] package.
"Laconic simplifies the generation of DOM content."
It also provides an extension of the ideas found in
[Backbone-UI][].

To all of that I've added a natural syntax for making
Bootstrap-aware objects, including Bootstrap's
sizing and context-coloring features;
automatic use of Bootstrap class names;
methods for making standard complex widgets like
grids, navbars, button-groups, forms.

Backstrap defines the global namespace `$$`.

Sample suggested use:

	$$.div(
		$$.span({context: 'danger'},
			'Uh-oh! ',
			$$.glyph('star')
		),
		$$.button({size: 'large'}, 'OK')
	);


which produces the DOM tree represented by this HTML code:

	<div>
	  <span class="text-danger">
	    Uh-oh! <span class="glyphicon glyphicon-star"></span>
	  </span>
	  <button class="btn btn-lg">OK</button>
	</div>

[bootstrap]:  http://getbootstrap.com/ "Bootstrap Homepage"
[backbone]:   http://backbonejs.org/ "Backbonejs Homepage"
[coenraets]   http://coenraets.org/blog/2013/04/sample-application-with-backbone-js-and-twitter-bootstrap-updated-and-improved/ "Christophe Coenraets Blog"
[github]      https://github.com/backstrap/backstrap "Backstrap on GitHub"
[packagist]   https://packagist.org/packages/backstrap/backstrap "Backstrap on Packagist"
[laconic]     https://github.com/joestelmach/laconic "Laconic on GitHub"
[lacLicense]  https://github.com/joestelmach/laconic/blob/master/LICENSE "Laconic License"
[backbone-ui] https://github.com/perka/backbone-ui "Backbone-UI on GitHub"
[bbuiLicense] https://github.com/perka/backbone-ui/blob/master/LICENSE "Backbone-UI License"


## Detailed usage

See the [laconic doc](http://joestelmach.github.io/laconic/)
for a description of laconic.
(I really should reproduce some of that information here.)
Everything there pretty much applies here, with the following changes:

- Backstrap defines the global namespace `$$` instead of laconic's `$.el`.
- if you pass a "size" attribute
it will be converted into a suitable Bootstrap classname.
- if you pass a "context" or "bgcontext" attribute
it will be converted into a suitable Bootstrap classname.
- if you pass a "glyph" attribute
it will be converted into a suitable Bootstrap classname.
Use just the distinct part of the Bootstrap glyphicon class,
e.g. `$$.span({glyph: "star"})` becomes <span class="glyphicon glyphicon-star">.
- there is a shortcut method `$$.glyph(name)` for creating glyphs.
`$$.glyph("star")` is equivalent to `$$.span({glyph: "star"})`.
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
(see [Bootstrap Attributes](#attrs) below.)
For example: 

	$$.div({'class' : 'example'}, 
		$$.div('content'));


### Bootstrap Tags

The special Bootstrap methods are:

#### alert

**To Be Implemented**

#### badge

The `$$.badge()` method creates a `span` with class "badge".

See also the Badge constructor, below.

#### breadcrumb

**To Be Implemented**

#### button

The `$$.button()` method creates an HTML `button` tag decorated with the Bootstrap "btn" class,
and optionally "btn-*" classes for sizing and context.

#### container

The `$$.container()` method creates an HTML `div` tag decorated with the Bootstrap "container" class,
and optionally "container-fluid" for fluid layout.

#### buttonGroup

**To Be Implemented**

#### form

**To Be Implemented**

#### glyph

The `$$.glyph(name)` method creates a `span` tag with class "glyphicon glyphicon-<name>".

See also the Glyph constructor, below.

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

Creates an HTML `input` tag decorated with the Bootstrap "input" class,
and optionally "input-*" classes for sizing and context.

#### inputGroup

**To Be Implemented**

#### jumbotron

The `$$.jumbotron()` method creates a `div` tag with class "jumbotron",
to make a Bootstrap Jumbotron.

<span id="label"></span>
#### label

The term "label" is, unfortunaterly, overloaded. The following methods are available:

- `$$.label()` gives you an HTML `label` tag with class "label".
- `$$.htmllabel()` gives you a bare HTML `label` tag.
- `$$.spanlabel()` gives you an HTML `span` tag with class "label".

<span id="attrs"></span>

#### listGroup

**To Be Implemented**

#### listGroupItem

**To Be Implemented**

#### media

**To Be Implemented**

#### pagination

**To Be Implemented**

#### panel

**To Be Implemented**

#### pageHeader

The `$$.pageHeader()` method creates a `div` tag with class "page-header",
to make a Bootstrap page header.

#### progressbar

**To Be Implemented**

#### thumbnail

**To Be Implemented**

#### well

The `$$.well()` method creates a `div` tag with class "well",
to make Bootstrap's simple well effect.


### Bootstrap attributes

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


### Object Constructors

The tag factory functions described above give you
an easy way to build nice static content.
But here's where things get even more fun!
The Backstrap object also provides constructors for several
object classes that extend `Backbone.View`, to give you powerful
(and good-looking!) data-driven, model-bound DOM widgets,
using the power of Backbone-UI.
For example:

- BasicNavbar
- Badge
- Button
- Context
- Glyph
- NavPills
- NavTabs
- Table

For efficiency, you should use the factory functions, like `$$.glyph()`,
for static graphics. Use the object constructors, like `$$.Glyph()`,
to bind a graphic object to a data model whose values may change
over the life of the page.

#### Badge

Creates a Bootstrap badge (a `span` with class="badge") whose content is model-bound.

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

Creates a Bootstrap button whose label is model-bound.

A simple example:

	var model = new Backbone.Model({name: 'Submit'});
	var button = new $$.Button({model: model, content: 'name'}).render();
	...
	// Alter the displayed label.
	model.set('name', 'Save as Draft');

#### Context

Creates a `span` whose Bootstrap context-color is model-bound.

A simple example - displays the text in a `span` with class "text-info":

	var model = new Backbone.Model({context: 'info'});
	var text = new $$.Context({model: model, content: 'context'}, 'This is some text').render();

Passing `background: true` makes it use the "bg-*" classes instead of "text-*".
You can also pass it a "tagName" attribute to create something other than a `span`.

#### Calendar

**To Be Implemented**

#### Checkbox

**To Be Implemented**

#### DatePicker

**To Be Implemented**

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

#### Link

**To Be Implemented**

#### List

**To Be Implemented**

#### Menu

**To Be Implemented**

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

#### Pulldown

**To Be Implemented**

#### RadioGroup

**To Be Implemented**

#### Table

**To Be Implemented**

#### TextArea

**To Be Implemented**

#### TextField

**To Be Implemented**

#### TimePicker

**To Be Implemented**


