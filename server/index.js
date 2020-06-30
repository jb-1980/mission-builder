require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const jwt = require("jsonwebtoken")
const { ApolloServer } = require("apollo-server-express")
const mongoose = require("mongoose")
const logger = require("morgan")
const { KhanApi } = require("khan-graphql")
const apiRoutes = require("./api_routes")
const { typeDefs } = require("./schema")
const { resolvers } = require("./resolvers")

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

const app = express()

app.use(express.static(path.resolve(__dirname, "../build")))
app.use(cookieParser())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

logger.token("body", (req) => JSON.stringify(req.body, null, 2))
const loggerFormat =
  process.env.NODE_ENV === "production"
    ? "short"
    : ":date[iso] :method :url :status :response-time :body"
app.use(logger(loggerFormat))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body

  const kapi = new KhanApi()
  const isLoggedIn = await kapi
    .authenticate(identifier, password)
    .catch((err) => {
      res.status(401).json({ error: "invalid username or password" })
      return false
    })
  if (isLoggedIn) {
    const tokens = jwt.sign({ identifier, password }, process.env.JWT_SECRET, {
      expiresIn: 1209600, // two weeks
    })
    const user = await kapi
      .getFullUserProfile()
      .then(({ data }) => data)
      .catch((err) => {
        console.error(err)
        return res.sendStatus(500)
      })

    let _user = user?.data?.user || {}
    res.cookie("tokens", tokens, { maxAge: 120960000 })
    res.send(200).json(_user)
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("tokens")
  return res.sendStatus(200)
})

app.use("/api", apiRoutes)

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build/index.html"))
  })
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { tokens } = req.cookies
    if (!tokens) return { token: null, secret: null }

    return jwt.verify(tokens, process.env.JWT_SECRET)
  },
})

server.applyMiddleware({ app })

const port = process.env.PORT || 4000
app.set("port", port)
app.listen(port, () => console.info(`🚀  Server ready at ${port}`))
