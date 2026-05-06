const prisma = require("../prisma");
async function getTournaments(req, res) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    // in case, we need to omit the ID
    //const result = tournaments.map(({ id, ...rest }) => rest);
    res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error encountered while retrieving tournaments", error);
    res.status(500).json({
      error: "Failed to fetch the tournament list. Please try again later",
    });
  }
}
module.exports = { getTournaments };
