const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const TournamentSchema = require("../../validations/tournamentValidation.js");
const prisma = require("../prisma.js");

//Create Tournament
const createTournament = async (req, res) => {
  if (!req.body) req.body = {};

  const { error, value } = TournamentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, //removes any fields not in the schema
  });

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  try {
    // deconstructing the values from the value if validated
    const {
      name,
      format,
      timeControl,
      startDate,
      location,
      totalRounds,
      category,
      tournamentType,
      endDate,
      published,
    } = value;

    const tournament = await prisma.tournament.create({
      data: {
        ...value,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: `${tournament.name} tournament created!`, tournament });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again" });
  }
};

//Get tournament
const getTournament = async (req, res) => {
  if (!req.params){
    return res.status(400).json({ message: 'Something went wrong'})
  }

  try {
    const { id } = req.params;


    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tournament not found" });
    }

    res.status(200).json({ message: `${tournament.name} found`, tournament });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Tournament not found'})
  }
};



// const getActiveTournaments = async (req, res) => {}
// const deleteTournament = async (req, res) => {}

// const createUser = async (req, res) => {}

// const getUsers= async (req, res) => {}

// const deleteUsers = async (req, res) => {}

module.exports = { createTournament, getTournament };
