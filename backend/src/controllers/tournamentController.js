const prisma = require("../prisma");
async function getTournaments(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tournaments, totalCount] = await Promise.all([
      prisma.tournament.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.tournament.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: tournaments,
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
    console.error("Error encountered while retrieving tournaments", error);
    res.status(500).json({
      error: "Failed to fetch the tournament list. Please try again later",
    });
  }
}

async function getRounds(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { tournamentId } = req.params;

    if (!tournamentId) {
      return res
        .status(400)
        .json({ error: "tournamentId is requerid in the request" });
    }

    const [rounds, totalRounds] = await Promise.all([
      prisma.round.findMany({
        skip: skip,
        take: limit,
        where: {
          tournamentId: tournamentId,
        },
        include: {
          matches: true,
        },
        orderBy: {
          roundNumber: "asc",
        },
      }),
      prisma.round.count({
        where: {
          tournamentId: tournamentId,
        },
      }),
    ]);
    const totalPages = Math.ceil(totalRounds / limit);
    res.status(200).json({
      data: rounds,
      pagination: {
        totalItems: totalRounds,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error encountered while fetching rounds and matches", error);
    res.status(500).json({
      error: "Failed to retrieve the tournament rounds.",
    });
  }
}

async function generateNextRound(req, res) {
  const { tournamentId } = req.params;

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        rounds: {
          orderBy: { roundNumber: "desc" },
          take: 1,
          include: { matches: true },
        },
        // We include match history to calculate color balance
        tournamentPlayers: {
          where: { status: "REGISTERED" },
          include: {
            matchesAsPlayer1: { select: { player1Color: true } },
            matchesAsPlayer2: { select: { player2Color: true } },
          },
        },
      },
    });

    if (!tournament)
      return res.status(404).json({ error: "Tournament not found." });

    let playersToPair = [];
    let nextRoundNumber = tournament.rounds.length + 1;
    // 1. Determine if last round finished and who advances
    const lastRound = tournament.rounds[0];
    const notFinished = lastRound.matches.filter(
      (m) => m.winnerPlayerId == null,
    );
    if (notFinished.length > 0) {
      return res.status(404).json({ error: "Last round not finished" });
    }
    if (tournament.rounds.length === 0) {
      playersToPair = tournament.tournamentPlayers;
    } else {
      const winnerIds = lastRound.matches
        .filter((m) => m.winnerPlayerId !== null)
        .map((m) => m.winnerPlayerId);

      playersToPair = tournament.tournamentPlayers.filter((p) =>
        winnerIds.includes(p.id),
      );
    }

    if (playersToPair.length <= 1 && nextRoundNumber > 1) {
      return res.status(400).json({ error: "No more rounds to generate." });
    }

    // 2. Shuffle to randomize pairings
    playersToPair.sort(() => Math.random() - 0.5);

    const result = await prisma.$transaction(async (tx) => {
      const newRound = await tx.round.create({
        data: {
          tournamentId,
          roundNumber: nextRoundNumber,
          title: `Round ${nextRoundNumber}`,
        },
      });

      const matchData = [];
      for (let i = 0; i < playersToPair.length; i += 2) {
        const p1 = playersToPair[i];
        const p2 = playersToPair[i + 1] || null;

        let p1Color = null;
        let p2Color = null;

        if (p2) {
          // 3. Color Logic: Calculate Balance
          const p1Balance =
            p1.matchesAsPlayer1.filter((m) => m.player1Color === "WHITE")
              .length -
            p1.matchesAsPlayer2.filter((m) => m.player2Color === "WHITE")
              .length;
          const p2Balance =
            p2.matchesAsPlayer1.filter((m) => m.player1Color === "WHITE")
              .length -
            p2.matchesAsPlayer2.filter((m) => m.player2Color === "WHITE")
              .length;

          // Assign White to the player with the lower balance
          if (p1Balance > p2Balance) {
            p1Color = "BLACK";
            p2Color = "WHITE";
          } else if (p1Balance < p2Balance) {
            p1Color = "WHITE";
            p2Color = "BLACK";
          } else {
            // If equal, flip a coin (random)
            p1Color = Math.random() > 0.5 ? "WHITE" : "BLACK";
            p2Color = p1Color === "WHITE" ? "BLACK" : "WHITE";
          }
        }

        matchData.push({
          roundId: newRound.id,
          player1Id: p1.id,
          player2Id: p2 ? p2.id : null,
          player1Color: p1Color,
          player2Color: p2Color,
          player1Score: 0, // Default scores to 0
          player2Score: 0,
          status: p2 ? "PENDING" : "COMPLETED",
          winnerPlayerId: p2 ? null : p1.id, // Bye handling
        });
      }

      await tx.match.createMany({ data: matchData });
      return newRound;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating the next round." });
  }
}
async function createMatch(req, res) {
  const {
    player1Id,
    player2Id,
    scheduledAt,
    player1Color,
    player2Color,
    status,
  } = req.body;
  const { roundId } = req.params;

  // Basic validation: A match must belong to a round
  if (!roundId) {
    return res
      .status(400)
      .json({ error: "roundId is required to create a match." });
  }

  try {
    const newMatch = await prisma.match.create({
      data: {
        roundId,
        player1Id,
        player2Id,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        player1Color,
        player2Color,
        status: status || "PENDING",
      },

      include: {
        round: { select: { roundNumber: true } },
        player1: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
        player2: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    return res.status(201).json(newMatch);
  } catch (error) {
    console.error(
      "Create Match Error: Invalid roundId or playerId provided.",
      error,
    );

    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "It was not possible to create the match" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateMatch(req, res) {
  const { matchId } = req.params; // Get match ID from URL
  const { player1Score, player2Score, status, winnerPlayerId } = req.body;

  try {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        player1Score,
        player2Score,
        status,
        winnerPlayerId,
        // We set finishedAt automatically if the status is COMPLETED
        finishedAt: status === "COMPLETED" ? new Date() : undefined,
      },
      include: {
        player1: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
        player2: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    return res.status(200).json(updatedMatch);
  } catch (error) {
    // P2025 the record wasn't found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Match not found" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteMatch(req, res) {
  const { matchId } = req.params;

  try {
    // We attempt to delete the match by its unique UUID
    const deletedMatch = await prisma.match.delete({
      where: { id: matchId },
    });
    return res.status(200).json({
      message: "Match deleted successfully",
      deletedMatch,
    });
  } catch (error) {
    // P2025 the record wasn't found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Match not found" });
    }

    console.error("Delete Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  getTournaments,
  getRounds,
  generateNextRound,
  updateMatch,
  deleteMatch,
  createMatch,
};
