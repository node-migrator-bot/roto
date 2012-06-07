#!/usr/bin/env node

/**
 * Command Line Interface
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

var path     = require('path'),
    fs       = require('fs'),
    roto     = require('../lib/roto.js'),
    optimist = require('optimist'),
    pkg      = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var argv = optimist.usage('Usage: $0 [target] [options]').argv;
	
// selected build target
// ------------------------------------------------------------------------------------

var target = argv._.length ? argv._[0] : 'all';

// extract global options
// ------------------------------------------------------------------------------------

var blacklist = ['_', '$0'];
var options = {};
for (var key in argv) {
	if (argv.hasOwnProperty(key) && blacklist.indexOf(key) === -1) {
		options[key] = argv[key];
	}
}
for (var i = 1; i < argv._.length; i++) {
	options[argv._[i]] = true;
}

// load project information
// ------------------------------------------------------------------------------------

var projectFile = process.cwd() + '/build.js';
if (!path.existsSync(projectFile)) {
	process.stderr.write('"build.js" project file not found.\n');
	process.exit(1);
}

require(projectFile)(roto);

// display help
// ------------------------------------------------------------------------------------

if (options['help']) {
	process.stdout.write(optimist.help());
	process.stdout.write('Available Targets:\n\n');
	
	// all
	process.stdout.write('   - all');
	if ('all' === roto.defaultTarget) {
		process.stdout.write(' (default)');
	}
	process.stdout.write('\n');
	
	// defined targets
	for (var key in roto._project.targets) {
		if (roto._project.targets.hasOwnProperty(key)) {
			process.stdout.write('   - ' + roto._project.targets[key].name);
			if (key === roto.defaultTarget) {
				process.stdout.write(' (default)');
			}
			process.stdout.write('\n');
		}
	}
	process.stdout.write('\n');
	
	return;
}

// execute build
// ------------------------------------------------------------------------------------

roto.run(target, options);