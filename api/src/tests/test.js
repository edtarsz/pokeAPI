// Mock de better-sqlite3
jest.mock('axios');
jest.mock('better-sqlite3', () => {
    const db = {
        exec: jest.fn(),
        prepare: jest.fn((query) => {
            // Mock para COUNT(*)
            if (query.includes('COUNT(*)')) {
                return {
                    get: jest.fn(() => ({ total: 2 })),
                };
            }
            // Mock para SELECT * con LIMIT
            if (query.includes('LIMIT')) {
                return {
                    all: jest.fn(() => [
                        { id: 1, name: 'Team Rocket', members: '["pikachu"]' },
                        { id: 2, name: 'Team Agua', members: '["squirtle"]' },
                    ]),
                };
            }
            // Mock para SELECT * WHERE id = ?
            if (query.includes('SELECT') && query.includes('WHERE id')) {
                return {
                    get: jest.fn((id) => {
                        if (id === '1') return { id: 1, name: 'Team Rocket', members: '["pikachu"]' };
                        return undefined;
                    }),
                };
            }
            // Mock para UPDATE
            if (query.includes('UPDATE')) {
                return {
                    run: jest.fn(() => ({ changes: 1 })),
                };
            }
            // Mock para DELETE
            if (query.includes('DELETE')) {
                return {
                    run: jest.fn(() => ({ changes: 1 })),
                };
            }
            // Mock para INSERT
            return {
                run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 })),
            };
        }),
    };
    return jest.fn(() => db);
});

import supertest from 'supertest';
import { app, server } from '../../server.js';
import axios from 'axios';

describe('API de Equipos', () => {
    afterAll((done) => {
        server.close(done);
    });

    afterEach(() => jest.clearAllMocks());

    test('POST /teams - crea un equipo', async () => {
        const res = await supertest(app)
            .post('/teams')
            .send({ name: 'Equipo Fuego', members: ['charmander'] });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(1);
    });

    test('POST /teams - error 400 si más de 6 miembros', async () => {
        const res = await supertest(app)
            .post('/teams')
            .send({ name: 'Equipo Excedido', members: [1, 2, 3, 4, 5, 6, 7] });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Error de validación.');
    });

    test('GET /teams - obtiene todos los equipos', async () => {
        await supertest(app).post('/teams').send({ name: 'Team Rocket', members: ['meowth'] });
        await supertest(app).post('/teams').send({ name: 'Team Aqua', members: ['kyogre'] });

        const res = await supertest(app).get('/teams');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0]).toHaveProperty('name', 'Team Rocket');
        expect(res.body.pagination).toHaveProperty('total', 2);
        expect(res.body.pagination).toHaveProperty('page', 1);
    });

    test('GET /teams/:id - enriquece con PokeAPI', async () => {
        axios.get.mockResolvedValue({
            data: { name: 'pikachu', types: [], sprites: { front_default: 'url' }, stats: [] }
        });

        const res = await supertest(app).get('/teams/1');

        expect(res.status).toBe(200);
        expect(res.body.members[0]).toHaveProperty('name', 'pikachu');
        expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    test('GET /teams/:id - 404 si no existe', async () => {
        const res = await supertest(app).get('/teams/999');
        expect(res.status).toBe(404);
    });

    test('PATCH /teams/:id - actualiza nombre del equipo', async () => {
        const res = await supertest(app)
            .patch('/teams/1')
            .send({ name: 'Team Rocket Actualizado', members: ['pikachu'] });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Team Rocket Actualizado');
        expect(res.body.members).toEqual(['pikachu']);
    });

    test('PUT /teams/:id - reemplaza completamente el equipo', async () => {
        const res = await supertest(app)
            .put('/teams/1')
            .send({ name: 'Team Nuevo', members: ['charizard', 'blastoise', 'venusaur'] });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Team Nuevo');
        expect(res.body.members).toHaveLength(3);
    });
});
