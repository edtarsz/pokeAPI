import { z } from 'zod';

export const createTeamSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'El nombre es requerido.'),
        members: z
            .array(z.union([z.string().min(1), z.number().int().positive()]))
            .min(1, 'El equipo debe tener al menos un miembro.')
            .max(6, 'Máximo 6 miembros.')
            .refine((items) => new Set(items).size === items.length, {
                message: 'No se permiten miembros duplicados.',
            }),
    }),
});