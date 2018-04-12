const basicAuth = require('express-basic-auth')
module.exports = function (users) {
  return basicAuth({
    users: users,
    challenge: true,
    realm: '{{{cell-name}}}'
  })
}
