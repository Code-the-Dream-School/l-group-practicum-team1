const Joi = require("joi");

const TournamentSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  format: Joi.string()
    .valid("ONLINE","OFFLINE")
    .required(), // replace with your actual TournamentFormat enum values
  timeControl: Joi.string().trim().min(1).required(),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "startDate must be in YYYY-MM-DD format",
    }),
  location: Joi.string().trim().allow(null, "").optional(),
  totalRounds: Joi.number().integer().positive().allow(null).optional(),
  category: Joi.string().trim().allow(null, "").optional(),
  tournamentType: Joi.string()
    .valid("SINGLE", "ROUND_ROBIN","DOUBLE_ELIMINATION", "SWISS")
    .default("SINGLE")
    .optional(), // replace with your actual TournamentType enum values
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "endDate must be in YYYY-MM-DD format",
    }),
  published: Joi.boolean().default(false).optional(),
});


module.exports = TournamentSchema