import { db } from '../services/db.js';
import { getPokemonDetails } from '../services/pokeapi.service.js';

export const createTeam = (req, res, next) => {
    const { name, members } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO teams (name, members) VALUES (?, ?)');
        const info = stmt.run(name, JSON.stringify(members));
        res.status(201).json({ id: info.lastInsertRowid, name, members });
    } catch (error) {
        next(error);
    }
};

export const getTeamById = async (req, res, next) => {
    try {
        const stmt = db.prepare('SELECT * FROM teams WHERE id = ?');
        const team = stmt.get(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }

        const memberNames = JSON.parse(team.members);

        const enrichedMembers = await Promise.all(
            memberNames.map(member => getPokemonDetails(member))
        );

        const enrichedTeam = { ...team, members: enrichedMembers };
        res.status(200).json(enrichedTeam);

    } catch (error) {
        next(error);
    }
};

export const getAllTeams = (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Total de equipos
        const countStmt = db.prepare('SELECT COUNT(*) as total FROM teams');
        const countResult = countStmt.get();
        const total = countResult ? countResult.total : 0;

        // Equipos paginados
        const stmt = db.prepare('SELECT * FROM teams LIMIT ? OFFSET ?');
        const teams = stmt.all(limit, offset);

        const parsedTeams = teams.map(team => ({
            ...team,
            members: JSON.parse(team.members)
        }));

        res.status(200).json({
            data: parsedTeams,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

export const updateTeam = (req, res, next) => {
    const { name, members } = req.body;
    try {
        const stmt = db.prepare('UPDATE teams SET name = ?, members = ? WHERE id = ?');
        const info = stmt.run(name, JSON.stringify(members), req.params.id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }
        res.status(200).json({ id: req.params.id, name, members });
    } catch (error) {
        next(error);
    }
};

export const deleteTeam = (req, res, next) => {
    try {
        const stmt = db.prepare('DELETE FROM teams WHERE id = ?');
        const info = stmt.run(req.params.id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

