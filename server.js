'use strict'

const path = require('node:path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const port = 12345

const protoPath = path.resolve(__dirname, 'hello.proto')
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  defaults: false
})
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

const methodImplementations = {
  SayHello (call, callback) {
    callback(null, {
      message: `Hello ${call.request.name}`
    })
  }
}

const startServer = async () => {
  const server = new grpc.Server()
  server.addService(protoDescriptor.hellopackage.GreeterService.service, methodImplementations)

  await new Promise((resolve, reject) => {
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
  server.start()
  console.log(`Greeter service gRPC is listening on port ${port}`)
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
  protoDescriptor,
  startServer
}
