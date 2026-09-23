import { prisma } from "../db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// Registrar Usuario
export const registrarUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        const existe = await prisma.usuario.findUnique({ where: { email } })
        if (existe) return res.status(401).json({ error: "Email registrado" });

        const hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({ data: { nombre, email, password: hash, rol: rol || "usuario" } });
        res.status(201).json({ nuevoUsuario: "Usuario creado correctamente", nuevoUsuario });
    } catch (error) {
        next(error);
    }
}

// login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existe = await prisma.usuario.findUnique({ where: { email } })
        if (!existe) return res.status(401).json({ error: "Credenciales invalidas" });

        const valido = bcrypt.compare(password, existe.password)
        if (!valido) return res.status(401).json({ error: "Credenciales invalidas" });

        const token = jwt.sign({ id: existe.id, email: existe.email, rol: existe.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" })
        res.json({ token });

    } catch (error) {
        next(error);
    }
}