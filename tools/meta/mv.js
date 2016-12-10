#!/usr/bin/env node
// Change the position of a file in the tree.

var source = process.argv[2];
var target = process.argv[3];
if (!source || !target) {
  console.log('Usage: ./tools/meta/mv.js /foo/bar /baz/bar');
  process.exit();
}

var driver = require('../../lib/driver.js');
var exec = require('child_process').execFileSync;
var path = require('path');

var sourceFile = path.join(__dirname, '..', '..', 'web', source);
var targetFile = path.join(__dirname, '..', '..', 'web', target);
var sourceMetafile = driver.metafile(source);
var targetMetafile = driver.metafile(target);

console.log(sourceFile, targetFile);
console.log(sourceMetafile, targetMetafile);

exec('mv', [sourceFile, targetFile]);
exec('mkdir', ['-p', path.dirname(targetMetafile)]);
exec('mv', [sourceMetafile, targetMetafile]);
if (exec('ls', [path.dirname(sourceMetafile)]) === '') {
  exec('rmdir', [path.dirname(sourceMetafile)]);
}
