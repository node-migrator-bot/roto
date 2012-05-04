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
		<th>Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td><code>files</code></td>
		<td><code>string</code> (or <code>array</code> of strings)</td>
		<td>Paths of handlebars templates to be compiled. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td><code>ignore</code></td>
		<td><code>string</code> (or <code>array</code> of strings)</td>
		<td>Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td><code>output</code></td>
		<td><code>string</code></td>
		<td>Path of the output file (js).</td>
	</tr>
</table>

### Sample:

```javascript
{
	files  : ['views/*.html']
	output : 'views.js'
}
```

## Examples

```javascript
roto.addTask('uglify', {
	files  : ['views/*.html']
	output : 'views.js'
});
```