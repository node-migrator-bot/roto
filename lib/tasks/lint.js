/**
 * lint.js - LINT JS Validation (via jshint)
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

var _        = require('underscore'),
    fs       = require('fs'),
    jshint   = require('jshint').JSHINT,
    colorize = require('../colorize.js');

// ---------------------------------------------------------------------------------

module.exports = function(roto) {
	
	roto.defineTask('lint', function(options, target, globalOptions) {
		var i, j, globbed;
	
		roto.notice('Lint Validation:\n');

		options = options || {};
	
		var errorsFound = 0;
		var jshintOptions = _.extend({
			curly: true,
			strict: false,
			smarttabs: true
		}, options.jshint);
	
		var analyzeFile = function(path) {
			var code = fs.readFileSync(path, 'utf8');
		
			roto.notice('   ' + path + ' ');
			if (jshint(code, jshintOptions)) {
				// success
				roto.notice('[' + colorize('pass', 'green') + ']\n');
			} else {
				// errors
				roto.error('[' + colorize('fail', 'red') + ']\n');
				var errors = jshint.data().errors;
				for (var i = 0; i < errors.length; i++) {
					if (!errors[i]) {
						continue;
					}
					roto.error('      (' + errors[i].line + ':' + errors[i].character + ') ' + errors[i].reason + '\n');
					if (typeof errors[i].evidence !== 'undefined') {
						roto.error('         ' + errors[i].evidence.replace(/^\s+/, '') + '\n');
					}
					errorsFound++;
				}
			}
		};
	
		// search for matching files
		var paths = roto.findFiles(options.files, options.ignore);
	
		// perform analysis
		if (paths.length) {
			paths.map(analyzeFile);
		} else {
			roto.notice('No matching files found.\n');
		}
	
		return errorsFound === 0;
	});
	
};
