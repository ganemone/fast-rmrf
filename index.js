// @flow
const cp = require('child_process');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

/*::
type OptionsType = {
	tmpDir?: string,
	fork?: boolean,
}

*/
module.exports = function fastRMRF(directory /*: string */, options /*: OptionsType */ = {}) {
	const tmpDir = options.tmpDir || os.tmpdir();
	const tmpDirPath = path.join(tmpDir, getHash());
  if (!fs.existsSync(directory)) {
    return null;
  }
  cp.execSync(`mkdir -p ${tmpDirPath}`);
  cp.execSync(`mv ${directory} ${tmpDirPath}`);
  const child = cp.spawn('rm', ['-rf', tmpDirPath], {
    detatched: options.fork !== false,
    stdio: 'ignore',
  });
  if (options.fork !== false) { 
    child.unref();
  }
  return tmpDirPath;
}


function getHash() {
	return crypto.randomBytes(10).toString('hex');
}
