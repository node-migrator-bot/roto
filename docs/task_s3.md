# s3 (bundled task)

Syncing a folder to S3 is really easy using the `s3` task. Provide the task with S3 credentials and the path of a local folder, and it will transfer the contents to S3. It maintains a remote manifest of files and their checksums so that later sync operations won't have to upload files that haven't changed (ala git / dropbox).

## Options

<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>key</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">S3 authorization key.</td>
	</tr>
	<tr>
		<td valign="top"><code>private</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Private S3 authrorization key.</td>
	</tr>
	<tr>
		<td valign="top"><code>method</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">The name of the operation to perform (currently only `sync`).</td>
	</tr>
	<tr>
		<td valign="top"><code>folder</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Path to the local folder to sync to S3.</td>
	</tr>
	<tr>
		<td valign="top"><code>destination</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">The path to the folder in the bucket to place the files. Default: "/"</td>
	</tr>
	<tr>
		<td valign="top"><code>ignore</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Any matching paths in `folder` will be ignored. Supports glob syntax.</td>
	</tr>
	<tr>
		<td valign="top"><code>headers</code></td>
		<td valign="top"><code>object</code></td>
		<td valign="top">Any headers to apply to all files.</td>
	</tr>
	<tr>
		<td valign="top"><code>bucket</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">The name of the S3 bucket to use.</td>
	</tr>
	<tr>
		<td valign="top"><code>concurrency</code></td>
		<td valign="top"><code>int</code></td>
		<td valign="top">How many simultaneous uploads to allow. Default: 3.</td>
	</tr>
	<tr>
		<td valign="top"><code>ttl</code></td>
		<td valign="top"><code>int</code></td>
		<td valign="top">The cache lifetime given to browsers requesting the files from S3 (in seconds). Default: 2678400 (31 days).</td>
	</tr>
	<tr>
		<td valign="top"><code>manifest</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">The filename of the generated manifest used for delta calculations. Default: ".manifest.json"</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('s3', {
	folder: 'public',
	ignore: ['*.less'],
	key: '*****',
	secret: '*************************',
	bucket: 'org-static',
	destination: '/',
	ttl: 32140800
});
```