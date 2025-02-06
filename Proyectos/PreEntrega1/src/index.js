import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";

import connectDb from "./database/index.js";
import userRoutes from "./routes/users.routes.js"
import viewRoutes from "./routes/views.routes.js"
import passport from "./config/passport.js"

//settings
const app = express();
app.set("PORT", 3000);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(passport.initialize());

const signature = "cookieSignature"
const URI= "mongodb+srv://manuelmanodescofre:Manodes3000@clusterproyectofinalman.f0jes.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProyectoFinalManuelManodes";


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(signature))

//routes
app.use('/api/users', userRoutes)
app.use('/', viewRoutes)

//listeners
connectDb(URI)

app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
