# concat (bundled task)

Concatenates multiple files into a single file.

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
		<td>Paths of files to be concatenated. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
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
	files  : 'css/*.css'
	ignore : 'css/lib.css',
	output : 'css/merged.css'
}
```

## Examples

```javascript
roto.addTask('concat', {
	files  : 'css/*.css'
	ignore : 'css/lib.css',
	output : 'css/merged.css'
});
```