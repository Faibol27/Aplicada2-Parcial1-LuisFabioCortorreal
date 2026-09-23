import { Router } from "express"
import { crearLibro, eliminarLibro, getLibros } from "../controllers/libros.controller.js"
import { admin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getLibros);
router.post("/", admin, crearLibro);
router.delete("/:id", admin, eliminarLibro);

export default router;