const Joi = require("joi");

const tournamentPlayerSchema = Joi.object({
  tournamentId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.guid": "There's a problem with the Tournament",
  }),

  userId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.guid": "There's a problem with the User",
  }),

  status: Joi.string()
    .trim()
    .uppercase()
    .valid("REGISTERED", "ELIMINATED", "WITHDRAWN")
    .default("REGISTERED"),

  seedNumber: Joi.number().integer().positive().allow(null).optional(),
});

const updateTournamentPlayerSchema = Joi.object({
  status: Joi.string()
    .trim()
    .uppercase()
    .valid("REGISTERED", "ELIMINATED", "WITHDRAWN")
    .optional(),

  seedNumber: Joi.number().integer().positive().allow(null).optional(),
});

module.exports = {
  tournamentPlayerSchema,
  updateTournamentPlayerSchema,
};
