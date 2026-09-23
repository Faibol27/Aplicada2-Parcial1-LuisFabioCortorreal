import { Router } from "express"
import { devolverLibro, pedirPrestamo } from "../controllers/prestamos.controller.js"
import {  } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", pedirPrestamo);
router.put("/:id/devolver", devolverLibro);

export default router;