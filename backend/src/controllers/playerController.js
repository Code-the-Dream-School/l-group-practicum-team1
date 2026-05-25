const { StatusCodes } = require("http-status-codes");
const prisma = require("../prisma");
const {
  updateTournamentPlayerSchema,
  tournamentPlayerSchema,
} = require("../../validations/playerValidation");
//Player
//Create Player
const createPlayer = async (req, res) => {
  if (!req.body) req.body = {};

  const validationPayload = {
    ...req.body,
    tournamentId: req.params.tournamentId,
    userId: req.user.id,
  };

  // 2. Pass the merged payload to your validator
  const { error, value } = tournamentPlayerSchema.validate(validationPayload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  try {
    const { tournamentId, userId, status, seedNumber } = value;

    const existingRegistration = await prisma.tournamentPlayer.findFirst({
      where: { tournamentId, userId },
    });

    if (existingRegistration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You are already registered for this tournament.",
      });
    }

    const newPlayerRegistration = await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        userId,
        status,
        seedNumber,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, rating: true },
        },
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Successfully joined the tournament!",
      registration: newPlayerRegistration,
    });
  } catch (error) {
    console.error("Error registering player to tournament:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again" });
  }
};
// Read Player
const readPlayer = async (req, res) => {
  const { idPlayer } = req.params; // The UUID of the tournament_player record

  try {
    // Fetch the tournament player record and pull in the related user and tournament data
    const playerDetails = await prisma.tournamentPlayer.findUnique({
      where: { id: idPlayer },
      include: {
        // Pulls in user information from the 'user' table
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            rating: true,
            role: true,
          },
        },
        // Optional: Pulls in basic tournament information so the frontend knows which tournament this is for
        tournament: {
          select: {
            name: true,
            format: true,
            timeControl: true,
          },
        },
      },
    });

    // If no record is found, return a 404
    if (!playerDetails) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "There's an issue with the player." });
    }

    // Send back the complete bundled data
    res.status(StatusCodes.OK).json({
      player: playerDetails,
    });
  } catch (error) {
    console.error("Error fetching player details:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again" });
  }
};

// Update player
const updatePlayer = async (req, res) => {
  const { idPlayer } = req.params; // The UUID of the tournament_player record
  if (!req.body) req.body = {};

  // 1. Validate the incoming update data
  const { error, value } = updateTournamentPlayerSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, // Drops tournamentId or userId if sent maliciously
  });

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  // If the request body is empty after stripping unknown fields, stop here
  if (Object.keys(value).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    // 2. Check if the player registration record actually exists
    const existingRegistration = await prisma.tournamentPlayer.findUnique({
      where: { id: idPlayer },
    });

    if (!existingRegistration) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "There's a problem with the player." });
    }

    // 3. Update the record with the validated fields
    const updatedPlayerRegistration = await prisma.tournamentPlayer.update({
      where: { id: idPlayer },
      data: value, // Dynamically updates status, seedNumber, or both
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // 4. Send back the updated data
    res.status(StatusCodes.OK).json({
      message: "Player registration updated successfully!",
      registration: updatedPlayerRegistration,
    });
  } catch (error) {
    console.error("Error updating tournament player:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again" });
  }
};

//Delete Player
const deletePlayer = async (req, res) => {
  const { tournamentId, playerId } = req.params;

  try {
    // 1. Verify the registration actually exists first
    const registration = await prisma.tournamentPlayer.findFirst({
      where: {
        tournamentId,
        id: playerId,
      },
    });

    if (!registration) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "There's a problem with the player" });
    }

    // 2. Delete the record using its unique identifier combination or ID
    await prisma.tournamentPlayer.delete({
      where: {
        id: registration.id, // Deleting by its unique primary key UUID
      },
    });

    res.status(StatusCodes.OK).json({
      message: "Player successfully removed from the tournament.",
    });
  } catch (error) {
    console.error("Error removing player from tournament:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again" });
  }
};

// Read All Players in a Tournament
const readAllPlayers = async (req, res) => {
  const { tournamentId } = req.params;

  // Pagination setup (defaults to page 1, 10 players per page)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // We use Promise.all to fetch the players and the total count simultaneously
    const [players, totalCount] = await Promise.all([
      prisma.tournamentPlayer.findMany({
        where: {
          tournamentId: tournamentId,
        },
        skip: skip,
        take: limit,
        // Order by seed number or creation date for a clean roster
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              rating: true,
            },
          },
        },
      }),
      prisma.tournamentPlayer.count({
        where: {
          tournamentId: tournamentId,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(StatusCodes.OK).json({
      data: players,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching tournament roster:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve the player roster. Please try again.",
    });
  }
};

module.exports = {
  createPlayer,
  readPlayer,
  updatePlayer,
  deletePlayer,
  readAllPlayers,
};
