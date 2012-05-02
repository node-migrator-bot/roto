# roto

#### A no-nonsense build tool for Node.js projects.

Roto is designed to be a lean build tool. Build targets are defined as functions—which can add tasks that are executed *sequentally*.

**To install**: `npm install -g roto`
   
## Bundled Tasks

A few common, useful tasks come built-in to roto.

* [**concat**](#) — File concatenation.
* [**handlebars**](#) — [Handlebars](http://handlebarsjs.com/) template precompilation to JS.
* [**lint**](#) — Javascript source validation (using [jshint](https://github.com/jshint/jshint/)).
* [**uglify**](#) — Javascript minification (using [uglifyjs](https://github.com/mishoo/UglifyJS)).

## Setting up a Project

Create `build.js` in your project root. Here's the basic idea:

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
	}

To set the **default target** that is used (if no target is specified when building), set `roto.defaultTarget`. If left unchanged, **all** targets are built.

	roto.defaultTarget = 'target-name';


## Executing a Build

### From Javascript

    var roto = require('roto');
    require('./build.js')(roto);
    roto.run('target-name');


### Command Line
    roto target-name