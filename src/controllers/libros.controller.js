import { prisma } from "../db.js"

// Obtener Libros
export const getLibros = async (req, res, next) => {
    try {
        const lista = await prisma.libro.findMany();
        res.json(lista);
    } catch (error) {
        next(error);
    }
};

// Crear Libros
export const crearLibro = async (req, res, next) => {
    try {
        const nuevoLibro = await prisma.libro.create({ data: { titulo: req.body.titulo, autor: req.body.autor } });
        res.status(201).json({ message: "Libro creado", nuevoLibro })
    } catch (error) {
        next(error)
    }
};

// Eliminar Libro
export const eliminarLibro = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existe = await prisma.libro.findUnique({ where: { id } })
        if (!existe) return res.status(404).json({ error: "Este libro no existe" });

        const eliminarLibro = await prisma.libro.delete({ where: { id } })
        res.json({ exito: "Libro eliminado correctamente", eliminarLibro });
    } catch (error) {
        next(error);
    }
};