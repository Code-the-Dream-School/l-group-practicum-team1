const Joi = require('joi'); //user Validation


const userSchema = Joi.object({
    firstName: Joi.string().trim().lowercase().required(),
    lastName: Joi.string().trim().lowercase().required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include upper and lower case letters, a number, and a special character.",
    }),
});


module.exports = userSchema