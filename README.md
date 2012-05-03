# roto

#### A no-nonsense build tool for Node.js projects.

Roto is designed to be a lean build tool. Build targets are defined as functions. Inside of which, simply add tasks that are executed *sequentally*. Roto is in its very early stages—use it with some caution.

**To install**: `npm install -g roto`
   
## Bundled Tasks

A few common, useful tasks come built-in to roto.

* [**concat**](#) — File concatenation.
* [**handlebars**](#) — [Handlebars](http://handlebarsjs.com/) template precompilation to JS.
* [**lint**](#) — Javascript source validation (using [jshint](https://github.com/jshint/jshint/)).
* [**uglify**](#) — Javascript minification (using [uglifyjs](https://github.com/mishoo/UglifyJS)).

## Setting up a Project

Create a `build.js` file in your project root. This is where you'll define all your build targets and set up the tasks that make up those targets. Here's the basic idea:

```javascript
module.exports = function(roto) {
	roto.addTarget('www', function() {
			
		// minify js files
		roto.addTask('uglify', {
			files  : ['js/*.js'],
			ignore : ['js/*.min.js'],
			output : 'js/combined.min.js'
		});
			
		// do something custom
		roto.addTask(function() {
			roto.notice('This isn\'t using a predefined task. Saweet.');
		});
	});
};
```

To set the **default target** that is used, set `roto.defaultTarget`. If left unchanged, **all** targets are built.

```javascript
roto.defaultTarget = 'target-name';
```

### Adding Predefined Tasks

To invoke a predefined task as part of your build process, use `roto.addTask(name, options)`—where `name` is the name of the predefined task.

```javascript
roto.addTask('uglify', {
	files  : ['js/*.js'],
	ignore : ['js/*.min.js'],
	output : 'js/combined.min.js'
});
```

### Adding Custom Tasks

If there's something specific you need to do that doesn't have to do with a predefined task, simply use `roto.addTask(callback)`:

```javascript
roto.addTask(function() {
	// logic goes here
});
```

## Odds & Ends

### Console Output

Two methods are provided for writing to the console: `roto.notice` and `roto.error`. **Note:** neither of these methods add line breaks to the end of your string like `console.log`, so don't forget them if you want them.

```javascript
// (writes to process.stdout)
roto.notice('Yo\n');
// (writes to process.stderr)
roto.error('Something borked.\n');
```

#### Colorizing Strings

A utility for colorizing strings comes bundled with roto.

```javascript
var colorize = require('./path/to/colorize.js');

roto.error(colorize('ERROR:', 'red') + ' Something borked.');
roto.error(colorize('SUCCESS:', 'green') + ' Something went right!');
```

The available colors are currently: `red`, `yellow`, `green`, and `white` (bold).

### Defining Reusable Tasks

For defining custom tasks that can be reused (like the predefined ones that come bundled with roto), use: 

```javascript
roto.defineTask(name, function(options, target, globalOptions) { ... });
```

The arguments provided to the callback are:

* `options` — User-provided options that are given when calling `roto.addTask`.
* `target` — Information about the target currently being executed `{ name: 'target-name', tasks: [...] }`.
* `globalOptions` — Options provided at the command line, or when calling `roto.run`.

## Executing a Build

### From Javascript

```javascript
var roto = require('roto');
require('./build.js')(roto);
roto.run('target-name');
```

### Command Line
    roto target-name