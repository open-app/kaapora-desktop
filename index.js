var menubar = require('menubar')
const server = require('open-app-graphql-server')
const patchql = require('patchql-graphql')
const gossip = require('ssb-gossip-graphql')
const replication = require('ssb-replication-graphql')
const datSharedFiles = require('dat-shared-files-graphql')
// const dat = require('dat-graphql')

server([
  patchql,
  gossip,
  replication,
  datSharedFiles,
  // dat,
], {
  scope: 'ssb-01Sk988Yyu',
  // auth: 'secret-key', // uncomment to use authentication
  // cors: 'https://mycoolservice.net', // uncomment to use cors
})

const appPath = process.env.DEV ? '/view/public' : '/view/build'

var mb = menubar({ dir: __dirname + appPath })

mb.on('ready', function ready () {
  console.log('app is ready')
  // your app code here
})
