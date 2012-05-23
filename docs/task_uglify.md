# uglify (bundled task)

Minification of client-side javascript is a breeze with the built-in `uglify` task. It takes one or more files, concatenates them, and minifies them down to a single file.

## Options

	
<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>files</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Paths of JS files to be minified. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td valign="top"><code>ignore</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td valign="top"><code>output</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Path of the output file.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('uglify', {
	files  : ['jquery.js', 'underscore.js']
	ignore : 'mysite.js',
	output : 'lib.js'
});
```