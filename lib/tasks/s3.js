/**
 * s3.js - S3 Uploading
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

var knox = require('knox');

// ---------------------------------------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('s3', function(options, target, globalOptions) {
		var localPaths = roto.findFiles(options.files, options.ignore);
		// TODO: use async queue to upload files
	});

}
