const mockTournaments = [
  {
    id: "tournament-1",
    name: "New York Spring Open",
    format: "OFFLINE",
    location: "New York",
    time_control: "G/25;d5",
    total_rounds: 4,
    category: "Open",
    tournament_type: "SINGLE",
    start_date: "2026-05-10",
    end_date: "2026-05-10",
    published: true,
  },
  {
    id: "tournament-2",
    name: "California Chess Classic",
    format: "OFFLINE",
    location: "California",
    time_control: "G/15;d3",
    total_rounds: 5,
    category: "Open",
    tournament_type: "SINGLE",
    start_date: "2026-05-12",
    end_date: "2026-05-12",
    published: true,
  },
  {
    id: "tournament-3",
    name: "Florida Rapid Cup",
    format: "OFFLINE",
    location: "Florida",
    time_control: "G/10;d5",
    total_rounds: 4,
    category: "Rapid",
    tournament_type: "SINGLE",
    start_date: "2026-05-15",
    end_date: "2026-05-15",
    published: true,
  },
  {
    id: "tournament-4",
    name: "Texas Online Knockout",
    format: "ONLINE",
    location: "Online",
    time_control: "G/5;d2",
    total_rounds: 3,
    category: "Blitz",
    tournament_type: "SINGLE",
    start_date: "2026-05-08",
    end_date: "2026-05-11",
    published: true,
  },
  {
    id: "tournament-5",
    name: "Chicago Weekend Chess",
    format: "OFFLINE",
    location: "Illinois",
    time_control: "G/30;d5",
    total_rounds: 4,
    category: "Open",
    tournament_type: "SINGLE",
    start_date: "2026-05-20",
    end_date: "2026-05-20",
    published: true,
  },
  {
    id: "tournament-6",
    name: "Seattle Chess Challenge",
    format: "OFFLINE",
    location: "Washington",
    time_control: "G/25;d5",
    total_rounds: 5,
    category: "Open",
    tournament_type: "SINGLE",
    start_date: "2026-05-25",
    end_date: "2026-05-25",
    published: true,
  },
  {
    id: "tournament-7",
    name: "Boston Junior Open",
    format: "OFFLINE",
    location: "Massachusetts",
    time_control: "G/20;d5",
    total_rounds: 4,
    category: "Junior",
    tournament_type: "SINGLE",
    start_date: "2026-05-05",
    end_date: "2026-05-05",
    published: true,
  },
  {
    id: "tournament-8",
    name: "Denver Online Arena",
    format: "ONLINE",
    location: "Online",
    time_control: "G/10;d0",
    total_rounds: 3,
    category: "Online",
    tournament_type: "SINGLE",
    start_date: "2026-06-01",
    end_date: "2026-06-01",
    published: false,
  },
];

export function getTournamentStatus(tournament) {
  const today = new Date().toISOString().split("T")[0];

  if (tournament.start_date > today) {
    return "upcoming";
  }

  if (tournament.end_date && tournament.end_date < today) {
    return "completed";
  }

  return "live";
}

export default mockTournaments;
