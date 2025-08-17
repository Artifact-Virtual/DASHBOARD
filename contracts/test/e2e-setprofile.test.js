const { spawn } = require('child_process');
const path = require('path');
const assert = require('assert');

describe('e2e setProfile script', function () {
  it('runs and exits 0', function (done) {
    this.timeout(20000);
    const script = path.join(__dirname, '..', 'scripts', 'e2e-setprofile.js');
    const proc = spawn('node', [script], { cwd: path.join(__dirname, '..') });

    let out = '';
    proc.stdout.on('data', (d) => { out += d.toString(); });
    proc.stderr.on('data', (d) => { out += d.toString(); });

    proc.on('close', (code) => {
      try {
        assert.strictEqual(code, 0, `script exited with code ${code}: ${out}`);
        // basic sanity: expect 'Stored CID' in output
        assert.ok(out.includes('Stored CID'), 'expected Stored CID in script output');
        done();
      } catch (err) { done(err); }
    });
  });
});
