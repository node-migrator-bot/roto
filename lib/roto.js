/**
 * roto - A no-nonsense build tool for Node.js projects.
 *
 * Copyright (c) 2012 DIY Co
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
	var isNewline     = true;
	
	var project = {
		name: 'Untitled Project',
		targets: {}
	};
	
	roto._project = project;
	roto.defaultTarget = 'all';
	
	/**
	 * Performs a glob search for files relative to the project root.
	 *
	 * @param  search  A path, or array of paths, to search for. Supports glob syntax.
	 * @param  ignore  A path, or array of paths, to ignore. Supports glob syntax.
	 */
	roto.findFiles = function(search, ignore) {
		var globbed;
		var ignorePaths = [];
		var paths = [];
		
		// search for ignore paths
		if (typeof ignore !== 'undefined') {
			if (typeof ignore === 'string') { ignore = [options.ignore]; }
			for (i = 0; i < ignore.length; i++) {
				globbed = glob.sync(ignore[i]);
				for (j = 0; j < globbed.length; j++) {
					ignorePaths[globbed[j]] = true;
				}
			}
		}
		
		// search for matching paths
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
	 * Writes a notice to the console (stdout).
	 
	 * @param  str    Message to write to the console.
	 * @param  color  [optional] Color name for string colorization.
	 */
 	roto.notice = function(str, color) {
		if (typeof color === 'string') {
			str = colorize(str, color);
		}
 		process.stdout.write((isNewline ? '  ' : '') + str);
 		isNewline = str[str.length - 1] === '\n';
 	};
	
	/**
	 * Writes an error to the console (stderr).
	 *
	 * @param  str    Message to write to the console.
	 * @param  color  [optional] Color name for string colorization.
	 */
	roto.error = function(str, color) {
		if (typeof color === 'string') {
			str = colorize(str, color);
		}
 		process.stderr.write((isNewline ? '  ' : '') + str);
		isNewline = str[str.length - 1] === '\n';
	};
	
	/**
	 * Sets up a target for the current project.
	 *
	 * @param  name      Target name.
	 * @param  callback  Target setup function.
	 */
	roto.addTarget = function(name, callback) {
		var target = project.targets[name] = {
			name  : name,
			tasks : [] 
		};

		currentTarget = target;
		callback();
		currentTarget = null;
	};
	
	/**
	 * Adds a task to the current target.
	 * Call this from a target setup method.
	 *
	 * Usage:
	 *     roto.addTask('lint', {
	 *        files: 'something.js'});
	 *     });
	 *     roto.addTask(function(callback) {
	 *         console.log('Do something');
	 *         callback();
	 *     });
	 * 
	 * @param  method       Callback, or name of the predefined task.
	 * @param  taskOptions  An object containing configuration info
	 *                      for the task when it executes.
	 */ 
	roto.addTask = function() {
		var taskOptions = arguments.length > 1 ? arguments[1] : null;
			
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
	 * Defines a task so that it can be invoked later,
	 * one or more times.
	 *
	 * @param  taskName  Name of the task.
	 * @param  callback  Function that performs the task.
	 */
	roto.defineTask = function(taskName, callback) {
		taskTemplates[taskName] = callback;
	};
	
	/**
	 * Build it!
	 *
	 * @param  targetName  The name of the target you want to build.
	 *                     To build all targets, use "all".
	 * @param  options     An object containing global options, provided
	 *                     to all tasks.
	 * @param  callback    Callback. Invoked upon build completion.
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