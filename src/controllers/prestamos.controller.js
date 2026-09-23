import { prisma } from "../db.js"

//Prestamo Libro 
export const pedirPrestamo = async (req, res, next) => {
    try {
        const { libroId } = req.body;
        const usuarioId = req.usuario?.id;
        const id = parseInt(libroId)

        const libro = await prisma.libro.findUnique({ where: { id } })
        if (!libro) return res.status(404).json({ error: "Este libro no existe" });
        if (!libro.disponible) return res.status(400).json({ error: "Este libro no esta disponible" });

        const prestamo = await prisma.prestamo.create({
            data: { usuarioId, libroId: { id } }, include: {
                libro: true,
                usuarioId: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });


        await prisma.libro.update({ where: { id }, data: { disponible: false } });

        res.status(201).json({ message: "Prestamo realizado", prestamo })
    } catch (error) {
        next(error);
    }
};

// Regresar libro
export const devolverLibro = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const prestamo = await prisma.prestamo.findUnique({
            where: { id },
            include: { libro: true }
        });

        if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" });
        if (prestamo.fechaFin !== null) return res.status(400).json({ error: "Este libro ya fue devuelto" });

        const prestamoActualizado = await prisma.prestamo.update({
            where: { id },
            data: { fechaFin: new Date() }
        });

        if (prestamo.libroId) {
            await prisma.libro.update({
                where: { id: prestamo.libroId },
                data: { disponible: true }
            });
        }
        res.json({ message: "Libro devuelto con éxito", prestamo: prestamoActualizado });
    } catch (error) {
        next(error);
    }
};

