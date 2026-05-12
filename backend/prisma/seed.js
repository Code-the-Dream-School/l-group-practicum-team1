const prisma = require("../src/prisma");
const bcrypt = require("bcryptjs")
async function seed() {
  await prisma.$transaction(async (tx) => {
    // delete existing sample tournament
    await tx.tournament.deleteMany({
      where: { name: "Test Chess Tournament" },
    });

    const admin = await tx.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        firstName: "Kenneth",
        lastName: "Thompson",
        email: "admin@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "ADMIN",
        isActive: true,
      },
    });

    const player1 = await tx.user.upsert({
      where: { email: "player1@test.com" },
      update: {},
      create: {
        firstName: "Magnus",
        lastName: "Carlsen",
        email: "player1@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1000,
      },
    });

    const player2 = await tx.user.upsert({
      where: { email: "player2@test.com" },
      update: {},
      create: {
        firstName: "Hikaru",
        lastName: "Nakamura",
        email: "player2@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1100,
      },
    });

    const player3 = await tx.user.upsert({
      where: { email: "player3@test.com" },
      update: {},
      create: {
        firstName: "Garry",
        lastName: "Kasparov",
        email: "player3@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1200,
      },
    });

    const player4 = await tx.user.upsert({
      where: { email: "player4@test.com" },
      update: {},
      create: {
        firstName: "Judit",
        lastName: "Polgar",
        email: "player4@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1300,
      },
    });

    const player5 = await tx.user.upsert({
      where: { email: "player5@test.com" },
      update: {},
      create: {
        firstName: "Bobby",
        lastName: "Fischer",
        email: "player5@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1400,
      },
    });

    const player6 = await tx.user.upsert({
      where: { email: "player6@test.com" },
      update: {},
      create: {
        firstName: "Hou",
        lastName: "Yifan",
        email: "player6@test.com",
        hashedPassword: "password123",
        role: "PLAYER",
        rating: 1500,
      },
    });

    const player7 = await tx.user.upsert({
      where: { email: "player7@test.com" },
      update: {},
      create: {
        firstName: "Viswanathan",
        lastName: "Anand",
        email: "player7@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1600,
      },
    });

    const player8 = await tx.user.upsert({
      where: { email: "player8@test.com" },
      update: {},
      create: {
        firstName: "Vladimir",
        lastName: "Kramnik",
        email: "player8@test.com",
        hashedPassword: await bcrypt.hash("pa$$word123", 10),
        role: "PLAYER",
        rating: 1700,
      },
    });

    const tournament = await tx.tournament.create({
      data: {
        name: "Test Chess Tournament",
        format: "OFFLINE",
        location: "New York City",
        timeControl: "10+0",
        totalRounds: 3,
        category: "Beginner",
        tournamentType: "SINGLE",
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-05-01"),
        published: true,
        tournamentAdmins: {
          create: {
            userId: admin.id,
          },
        },
        tournamentPlayers: {
          create: [
            { userId: player1.id, seedNumber: 1 },
            { userId: player2.id, seedNumber: 2 },
            { userId: player3.id, seedNumber: 3 },
            { userId: player4.id, seedNumber: 4 },
            { userId: player5.id, seedNumber: 5 },
            { userId: player6.id, seedNumber: 6 },
            { userId: player7.id, seedNumber: 7 },
            { userId: player8.id, seedNumber: 8 },
          ],
        },
      },
    });

    const round = await tx.round.create({
      data: {
        tournamentId: tournament.id,
        roundNumber: 1,
        title: "Quarterfinals",
      },
    });

    const tournamentPlayers = await tx.tournamentPlayer.findMany({
      where: { tournamentId: tournament.id },
      orderBy: { seedNumber: "asc" },
    });

    await tx.match.create({
      data: {
        roundId: round.id,
        player1Id: tournamentPlayers[0].id,
        player2Id: tournamentPlayers[7].id,
        scheduledAt: new Date("2026-05-01T14:00:00"),
        player1Color: "WHITE",
        player2Color: "BLACK",
        status: "PENDING",
      },
    });

    await tx.match.create({
      data: {
        roundId: round.id,
        player1Id: tournamentPlayers[1].id,
        player2Id: tournamentPlayers[6].id,
        scheduledAt: new Date("2026-05-01T14:30:00"),
        player1Color: "WHITE",
        player2Color: "BLACK",
        status: "PENDING",
      },
    });

    await tx.match.create({
      data: {
        roundId: round.id,
        player1Id: tournamentPlayers[2].id,
        player2Id: tournamentPlayers[5].id,
        scheduledAt: new Date("2026-05-01T15:00:00"),
        player1Color: "WHITE",
        player2Color: "BLACK",
        status: "PENDING",
      },
    });

    await tx.match.create({
      data: {
        roundId: round.id,
        player1Id: tournamentPlayers[3].id,
        player2Id: tournamentPlayers[4].id,
        scheduledAt: new Date("2026-05-01T15:30:00"),
        player1Color: "WHITE",
        player2Color: "BLACK",
        status: "PENDING",
      },
    });
  });

  console.log("Seed data created successfully");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(`Prisma disconnected`)
  });
