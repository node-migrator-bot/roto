# uglify (bundled task)

Minification of client-side javascript is a breeze with the built-in `uglify` task. It takes one or more files, concatenates them, and minifies them down to a single file.

## Options

	
<table>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td><code>files</code></td>
		<td><code>string</code> (or <code>array</code> of strings)</td>
		<td>Paths of JS files to be minified. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td><code>ignore</code></td>
		<td><code>string</code> (or <code>array</code> of strings)</td>
		<td>Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td><code>output</code></td>
		<td><code>string</code></td>
		<td>Path of the output file.</td>
	</tr>
</table>

### Sample:

```javascript
{
	files  : ['file.js', 'js/*.js']
	ignore : ['*.min.js'],
	output : 'output.min.js'
}
```

## Examples

```javascript
roto.addTask('uglify', {
	files  : ['jquery.js', 'underscore.js']
	ignore : ['lib.js', 'mysite.js'],
	output : 'lib.js'
})
```