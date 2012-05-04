# concat (bundled task)

Concatenates multiple files into a single file.

## Options

	
<table>
	<tr>
		<th>Option</th>
		<th style="width:220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>files</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Paths of files to be concatenated. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
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