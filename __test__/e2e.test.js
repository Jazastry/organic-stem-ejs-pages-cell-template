const path = require('path')
const os = require('os')
const execa = require('execa')
const request = require('async-request')
const terminate = require('terminate')

const get = async function (url, options) {
  return request(url, options)
}

const timeout = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())

test('stack upgrade', async () => {
  jest.setTimeout(60 * 1000)
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'cell-name': 'test',
      'cell-port': 13371,
      'cell-group': 'default'
    }
  })
})

test('the cell works', async () => {
  let cmds = [
    'cd ' + tempDir + '/cells/test',
    'node ./index'
  ]
  let child = execa.shell(cmds.join(' && '))
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  await timeout(1000)
  let result = await get('http://localhost:13371')
  expect(result.body).toContain('Landing')
  expect(result.body).toContain('1.0.0')
  result = await get('http://localhost:13371/asdasdasd')
  expect(result.body).toContain('not found')
  result = await get('http://localhost:13371/throw-error')
  expect(result.body).toContain('Error')
  let auth = 'Basic ' + Buffer.from('admin:123').toString('base64')
  result = await get('http://localhost:13371/hidden', {
    headers: {
      'Authorization': auth
    }
  })
  expect(result.body).toContain('Hidden')
  terminate(child.pid)
})
