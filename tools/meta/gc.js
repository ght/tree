// Remove metafiles that have no associated files.

var driver = require('../../lib/driver.js');
var exec = require('child_process').execFileSync;
var path = require('path');
var fs = require('fs');

var treeFolder = process.argv[2];
var metaFolder = process.argv[3];

if (!treeFolder || !metaFolder) {
  console.log('Usage: node ./tools/meta/gc.js tree/ meta/');
  process.exit();
}

treeFolder = path.resolve(treeFolder);
metaFolder = path.resolve(metaFolder);
driver.setMetaRoot(metaFolder);

var files = ('' + exec('find', [treeFolder, '-type', 'f']))
  .slice(0, -1)  // Remove newline at the end.
  .split('\n')
  .map(function(f) { return f.slice(treeFolder.length); });
var validMetafilesMap = Object.create(null);
for (var i = 0; i < files.length; i++) {
  validMetafilesMap[driver.metafile(files[i])] = true;
}

var metafiles = ('' + exec('find', [metaFolder, '-type', 'f']))
  .slice(0, -1)  // Remove newline at the end.
  .split('\n')
  .map(function(f) { return path.resolve(f); });

var invalidMetafiles = metafiles.filter(function(m) {
  return !validMetafilesMap[m];
});

for (var i = 0; i < invalidMetafiles.length; i++) {
  var f = invalidMetafiles[i];
  fs.unlinkSync(f);
  var folder = path.dirname(f);
  if (String(exec('ls', [folder])) === '') {
    exec('rmdir', [folder]);
  }
}