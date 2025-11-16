import connectToDb from "./DataBase/db.js";
import router from "./Routes/user.route.js"
import cors from "cors"
import express from "express";
const port = 3000;
const app = express();
import dotenv from "dotenv";

dotenv.config({
  path: ".env"
})

connectToDb();

const corsOptions = {
  origin: 'http://localhost:5174',
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Add this middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// user router 
app.use("/user", router);

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`)
})