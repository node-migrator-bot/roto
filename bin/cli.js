#!/usr/bin/env node

var program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    roto = require('../lib/roto.js'),
	pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// load the project
var projectFile = process.cwd() + '/build.js';
if (!path.existsSync(projectFile)) {
	process.stderr.write('"build.js" project file not found.\n');
	process.exit(1);
}

require(projectFile)(roto);
var buildTarget = function(target) {
	roto.run(target, {});
};

// setup the cli
program.version(pkg.version);
program.usage('<target> [options]');

program
	.command('*')
	.description('Build the given target')
	.action(buildTarget);

program.on('--help', function() {
	process.stdout.write('   Available Targets:\n\n');
	
	// all
	process.stdout.write('   all');
	if ('all' === roto.defaultTarget) {
		process.stdout.write(' (default)');
	}
	process.stdout.write('\n');
	
	// defined targets
	for (var key in roto._project.targets) {
		if (roto._project.targets.hasOwnProperty(key)) {
			process.stdout.write('   ' + roto._project.targets[key].name);
			if (key === roto.defaultTarget) {
				process.stdout.write(' (default)');
			}
			process.stdout.write('\n');
		}
	}
	process.stdout.write('\n');
});

program.parse(process.argv);

if (process.argv.length === 2) {
	buildTarget('all');
}