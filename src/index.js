import "dotenv/config"
import express from "express";
import { apiKey } from "./middlewares/apiKey.middleware.js"
import { verificarToken } from "./middlewares/auth.middleware.js"
import auth from "./routes/auth.routes.js"
import librosRoutes from "./routes/libros.routes.js"
import prestamosRoutes from "./routes/prestamos.routes.js"

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// Rutas publicas
app.use("/auth", auth)

// Libros
app.use("/libros", verificarToken, librosRoutes);

// Prestamos
app.use("/prestamos", verificarToken, prestamosRoutes)

app.listen(PORT, () => {
    console.log(`servidor en el puesto ${PORT}`)
});

