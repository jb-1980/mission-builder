const proxy = require("http-proxy-middleware")

module.exports = function(app) {
  app.use(proxy("/graphql", { target: "http://localhost:4000/" }))
  app.use(proxy("/api/", { target: "http://localhost:4000/" }))
  app.use(proxy("/login", { target: "http://localhost:4000/" }))
  app.use(proxy("/logout", { target: "http://localhost:4000/" }))
  app.use(proxy("/authenticate_khan", { target: "http://localhost:4000/" }))
}
