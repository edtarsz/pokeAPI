export function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // Error de PokeAPI no disponible
    if (err.message.includes('PokeAPI no disponible')) {
        return res.status(502).json({ message: 'Bad Gateway: El servicio de Pokémon no está disponible.' });
    }

    // Error de Pokémon no encontrado en PokeAPI
    if (err.message.includes('no encontrado en PokeAPI')) {
        return res.status(400).json({ message: err.message });
    }

    // Error de constraint de unicidad
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ message: 'Conflicto: ya existe un equipo con ese nombre.' });
    }

    // Error genérico del servidor
    res.status(500).json({ message: '¡Algo salió mal en el servidor!' });
}