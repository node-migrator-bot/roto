/**
 * roto - A no-nonsense build tool for Node.js projects.
 *
 * Copyright (c) 2012 DIY Co.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this 
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under 
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF 
 * ANY KIND, either express or implied. See the License for the specific language 
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@diy.org>
 */

// Notes:
// If any task fails, that target will halt and an error message will be given.
// Other queued targets will continue.

// ---------------------------------------------------------------------------------

var _        = require('underscore')._,
    fs       = require('fs'),
    glob     = require('glob'),
	colorize = require('./colorize.js');

// ---------------------------------------------------------------------------------

var roto = module.exports = (function() {
	var roto = {};
	
	var currentTarget = null;
	var taskTemplates = {};
	var globalOptions = {};
	var isNewline = true;
	var project = {
		name: 'Untitled Project',
		targets: {}
	};
	
	roto._project = project;
	roto.defaultTarget = 'all';
	
	/**
	 * Performs a glob search.
	 */
	roto.findFiles = function(search, ignore) {
		var globbed;
		var ignorePaths = [];
		
		if (typeof ignore !== 'undefined') {
			if (typeof ignore === 'string') { ignore = [options.ignore]; }
			for (i = 0; i < ignore.length; i++) {
				globbed = glob.sync(ignore[i]);
				for (j = 0; j < globbed.length; j++) {
					ignorePaths[globbed[j]] = true;
				}
			}
		}

		var paths = [];
		if (typeof search === 'string') { search = [search]; }
		for (i = 0; i < search.length; i++) {
			globbed = glob.sync(search[i]);
			for (j = 0; j < globbed.length; j++) {
				if (ignorePaths.hasOwnProperty(globbed[j])) {
					continue; 
				}
				paths.push(globbed[j]);
			}
		}
		
		return paths;
	};
	
	/**
	 * Writes a notice to the console.
	 */
 	roto.notice = function(str, color) {
 		str = (typeof color === 'string') ? colorize(str, color) : str;
 		process.stdout.write((isNewline ? '  ' : '') + str);
 		isNewline = str[str.length - 1] === '\n';
 	};
	
	/**
	 * Writes an error to the console.
	 */
	roto.error = function(str, color) {
		str = (typeof color === 'string') ? colorize(str, color) : str;
		process.stderr.write((isNewline ? '  ' : '') + str);
		isNewline = str[str.length - 1] === '\n';
	};
	
	/**
	 * roto.addTarget(name, callback);
	 * 
	 * Adds a target to the current project.
	 */
	roto.addTarget = function(name, callback) {
		var target = project.targets[name] = {
			name: name,
			tasks: [] 
		};

		currentTarget = target;
		callback();
		currentTarget = null;
	};
	
	/**
	 * roto.addTask();
	 *
	 * Adds a task to the current target.
	 * Call this from the target setup callback.
	 *
	 * Usage:
	 *     roto.addTask('lint', {files: 'something.js'});
	 *     roto.addTask(function(callback) {
	 *         console.log('Do something');
	 *         callback();
	 *     });
	 */ 
	roto.addTask = function(taskName, taskOptions) {
		if (!currentTarget) {
			roto.error(colorize('ERROR:', 'red') + ' roto.addTask() can only be called within the roto.addTarget() callback.\n');
			return false;
		}
		
		if (typeof arguments[0] === 'function') {
			var fn = arguments[0];
			currentTarget.tasks.push(function(callback) {
				fn(callback, taskOptions, currentTarget, globalOptions);
			});
		} else {
			var taskName = arguments[0];
			currentTarget.tasks.push(function(callback) {
				if (typeof taskTemplates[taskName] !== 'function') {
					roto.error(colorize('ERROR:', 'red') + ' "' + taskName + '" task not defined.\n');
					callback();
				} else {
					taskTemplates[taskName](callback, taskOptions, currentTarget, globalOptions);
				}
			});
		}
	};
	
	/**
	 * roto.defineTask();
	 *
	 * Defines a task template.
	 */
	roto.defineTask = function(taskName, callback) {
		taskTemplates[taskName] = callback;
	};
	
	/**
	 * roto.run();
	 *
	 * Build it!
	 */
	roto.run = function(targetName, options, callback) {
		var i;
		targetName = targetName || roto.defaultTarget;
		
		// determine selected targets
		var selectedTargets = [];
		if (typeof targetName === 'string') {
			targetName = targetName.toLowerCase();
			if (targetName === 'all') {
				for (var key in project.targets) {
					if (project.targets.hasOwnProperty(key)) {
						selectedTargets.push(key);
					}
				}
			} else {
				selectedTargets.push(targetName);
			}
		}
		
		// check that all targets exist
		if (!selectedTargets.length) {
			roto.error('No build targets were found.\n');
			return false;
		} 
		for (i = 0; i < selectedTargets.length; i++) {
			if (!project.targets.hasOwnProperty(selectedTargets[i])) {
				roto.error(colorize('ERROR:', 'red') + ' "' + selectedTargets[i] + '" target not found.\n');
				return false;
			}
		}
		
		// task iterator
		var executeTasks = function(target, callback) {
			var i = 0;
			var iterator = function() {
				if (i === target.tasks.length) {
					callback();
					return;
				}
				target.tasks[i++](iterator);
			};
			iterator();
		};
			
		// build all targets
		var executeTargets = (function() {
			var i = 0;
			var iterator = function() {
				if (i === selectedTargets.length) {
					if (typeof callback === 'function') {
						callback();
					}
					return;
				}
				currentTarget = project.targets[selectedTargets[i++]];
				roto.notice('Building "' + currentTarget.name + '"...\n');
				executeTasks(currentTarget, iterator);
			};
			iterator();
		})();
	};
	
	return roto;
})();

// ---------------------------------------------------------------------------------

require(__dirname + '/tasks/concat.js')(roto);
require(__dirname + '/tasks/handlebars.js')(roto);
require(__dirname + '/tasks/lint.js')(roto);
require(__dirname + '/tasks/s3.js')(roto);
require(__dirname + '/tasks/uglify.js')(roto);