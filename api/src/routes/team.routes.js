import express from 'express';
import { createTeam, getAllTeams, getTeamById, deleteTeam, updateTeam } from '../controllers/teams.controller.js';
import { validate } from '../middleware/validator.middleware.js';
import { createTeamSchema } from '../schemas/team.schema.js';

const router = express.Router();

router.get('/', getAllTeams);
router.post('/', validate(createTeamSchema), createTeam);
router.get('/:id', getTeamById);
router.patch('/:id', validate(createTeamSchema), updateTeam);
router.put('/:id', validate(createTeamSchema), updateTeam);
router.delete('/:id', deleteTeam);

export default router;