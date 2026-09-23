import jwt from "jsonwebtoken"

export const verificarToken = (req, res, next) => {
    const autheader = req.headers["authorization"]
    if (!autheader) return res.status(401).json({ error: "Token requerido" });

    const token = autheader.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = decoded;
        next()
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const admin = async (req, res, next) => {
    if (req.usuario.rol !== "admin") return res.status(401).json({ error: "No cuentas con permiso para realizar esta accion " });
    next();
}