/**
 * mocha.js - Testing Framework
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

var _     = require('underscore'),
    spawn = require('child_process').spawn,
    mocha = require('mocha');

// ---------------------------------------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('mocha', function(callback, options, target, globalOptions) {
		_.defaults(options, {
			reporter : 'list',
			colors   : true,
			growl    : false,
			timeout  : false,
			compress : true,
			files    : [],
			ignore   : []
		});
		
		// read all test files
		var paths = roto.findFiles(options.files, options.ignore);
		if (!paths.length && options.files.length) {
			callback();
			return;
		}
		
		// assemble command line arguments
		var args = [];
		
		args.push('--reporter');
		args.push(options.reporter);
		args.push(options.colors ? '--colors' : '--no-colors');
		
		if (options.timeout) {
			args.push('--timeout');
			args.push(options.timeout);
		}
		if (options.growl) {
			args.push('--growl');
		}
		for (var i = 0; i < paths.length; i++) {
			args.push(paths[i]);
		}
		
		// start mocha
		args.unshift(roto.dirname + '/node_modules/.bin/_mocha');
		var proc = spawn(process.argv[0], args, {
			cwd: process.cwd()
		});
		
		proc.stderr.on('data', function(line) {
			process.stderr.write(line);
		});
		
		proc.stdout.on('data', function(line) {
			line = line.toString();
			if (options.compress && line.match(/^\s+$/)) {
				return;
			}
			process.stdout.write(line);
		});
		
		proc.on('exit', function() {
			callback();
		});
	});

};