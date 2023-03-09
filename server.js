'use strict'

const path = require('node:path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { setTimeout: sleep } = require('node:timers/promises')
const { compose } = require('node:stream')

const port = 12345

const protoPath = path.resolve(__dirname, 'service.proto')
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  defaults: false
})
const grpcObject = grpc.loadPackageDefinition(packageDefinition)

async function * generateMessages () {
  let i = 100000
  while (i-- > 0) {
    await sleep(10) // eslint-disable-line no-await-in-loop
    yield {
      message: i.toString()
    }
  }
}

async function * passthrough (iterator) {
  console.log('before passthrough')
  for await (const item of iterator) {
    console.log('before', item)
    yield item
    console.log('after', item)
  }
  console.log('after passthrough')
}

const methodImplementations = {
  // server streaming
  StreamHello (call) {
    const responseStream = compose(generateMessages, passthrough)

    call.on('cancelled', () => {
      console.log('cancelled')
    })

    // call is a writable stream
    responseStream.pipe(call)
  }
}

const startServer = async () => {
  const server = new grpc.Server()
  server.addService(grpcObject.mypackage.GreeterService.service, methodImplementations)

  await new Promise((resolve, reject) => {
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
  server.start()
  console.log(`Greeter service is listening on port ${port}`)
}

// start server only if this module was called directly via command line
// and not when it was required from another module
if (require.main === module) {
  startServer()
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

module.exports = {
  port,
  grpcObject,
  startServer
}
