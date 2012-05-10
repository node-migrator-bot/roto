# mocha (bundled task)

The `mocha` task provides a comprehensive testing framework to your build system, using [mocha](http://visionmedia.github.com/mocha/).

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
		<td valign="top">Paths of test scripts. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>. If this isn't provided, it will default to all files in the `./test` directory.</td>
	</tr>
	<tr>
		<td valign="top"><code>colors</code></td>
		<td valign="top"><code>bool</code></td>
		<td valign="top">Colorize the console output.</td>
	</tr>
	<tr>
		<td valign="top"><code>timeout</code> (ms)</td>
		<td valign="top"><code>int</code></td>
		<td valign="top">After this many milliseconds, the tests will be killed if they haven't completed.</td>
	</tr>
	<tr>
		<td valign="top"><code>reporter</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">The name of the output reporter to use. See "[reporters](http://visionmedia.github.com/mocha/#reporters)" for more info.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('mocha', {
	files    : 'test/*.js',
	reporter : 'spec'
});
```