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
  if (!req.params) {
    return res.status(400).json({ message: "Something went wrong" });
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
    res.status(500).json({ message: "Tournament not found" });
  }
};

//Delete Tournament
const deleteTournament = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Tournament not Found" });
  }
  try {
    const deleteTourney = await prisma.tournament.delete({
      where: { id },
    });
    return res.status(StatusCodes.OK).json({
      message: `${deleteTourney.name} has been deleted`,
      tournament: deleteTourney,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Tournament not found" });
    }
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

//getUsers firstName, lastName, and rating
const getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        rating: true,
      },
      where: { role: { not: "ADMIN" } },
    });
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No users Found" });
  }
};

// const createUsers = async (req, res) => {};

const deleteUsers = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Player not found" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(StatusCodes.OK).json({ message: "User deleted" });
  } catch (err) {
    res.status(404).json({ message: "User not found" });
    next(err);
  }
};

async function searchUsers(req, res) {
  const searchQuery = req.query.search;
  if (!searchQuery || searchQuery.trim().length < 1) {
    return res.status(400).json({
      error: "Search query must be at least 1 characters long",
    });
  }

  // Get limit from query (default to 20)
  const limit = parseInt(req.query.limit) || 20;

  // Construct search patterns outside the query for proper parameterization
  const searchPattern = `%${searchQuery}%`;
  const exactMatch = searchQuery;
  const startsWith = `${searchQuery}%`;

  // Use raw SQL for complex text search with parameterized queries
  const searchResults = await prisma.$queryRaw`
SELECT 
      u.id,
      u.first_name as "firstName",
      u.last_name as "lastName",
      u.rating
    FROM "user" u
    WHERE (
      u.first_name ILIKE ${searchPattern}
      OR u.last_name ILIKE ${searchPattern}
    )
    AND u.role = 'PLAYER'
    ORDER BY 
      CASE 
        WHEN u.last_name ILIKE ${exactMatch} THEN 1
        WHEN u.last_name ILIKE ${startsWith} THEN 2
        WHEN u.last_name ILIKE ${searchPattern} THEN 3
        ELSE 4
      END,
      u.created_at DESC
    LIMIT ${limit}`;

  res.status(200).json({
    results: searchResults,
    query: searchQuery,
    count: searchResults.length,
  });
}

module.exports = {
  createTournament,
  getTournament,
  deleteTournament,
  getUsers,
  searchUsers,
  deleteUsers,
};
