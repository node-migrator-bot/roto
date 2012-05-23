# handlebars (bundled task)

The `handlebars` task precompiles [handlebars](http://handlebarsjs.com/) templates to a javascript file. This is extremely useful when needing to use templating on the client-side, so that no sluggish template parsing has to be done by the browser.

Templates will be added to the `Handlebars.templates` object. The template name is simply the filename, minus the extension. For example, if you have a template at `comment.html`, the template can be executed like this:

```javascript
var output = Handlebars.templates['comment']({
	message: 'Greetings earthling',
	user: 'ET'
});
```

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
		<td valign="top">Paths of handlebars templates to be compiled. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td valign="top"><code>ignore</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td valign="top"><code>output</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Path of the output file (js).</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('uglify', {
	files  : ['views/*.html']
	output : 'views.js'
});
```