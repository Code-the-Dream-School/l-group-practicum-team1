import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import TournamentRow from "../components/tournaments/TournamentRow";
import Pagination from "../components/ui/Pagination";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // const tournaments = [
  //   {
  //     id: "1",
  //     name: "Tournament Name 1",
  //     location: "New York, USA",
  //     format: "offline",
  //     category: "1",
  //     timeControl: "10+5",
  //     startDate: "2026-06-01",
  //     endDate: "2026-06-02",
  //   },
  //   {
  //     id: "2",
  //     name: "Tournament Name 2",
  //     location: "",
  //     format: "online",
  //     category: "2",
  //     timeControl: "10+5",
  //     startDate: "2026-06-02",
  //     endDate: "2026-07-02",
  //   },
  //   {
  //     id: "3",
  //     name: "Tournament Name 3",
  //     location: "New York, USA",
  //     format: "offline",
  //     category: "1",
  //     timeControl: "10+5",
  //     startDate: "2026-06-01",
  //     endDate: "2026-06-02",
  //   },
  //   {
  //     id: "4",
  //     name: "Tournament Name 4",
  //     location: "",
  //     format: "online",
  //     category: "2",
  //     timeControl: "10+5",
  //     startDate: "2026-06-02",
  //     endDate: "2026-07-02",
  //   },
  // ];

  useEffect(() => {
    async function fetchTournaments() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tournaments?page=${currentPage}&limit=${tournamentsPerPage}&search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tournaments");
        }

        const data = await response.json();

        setTournaments(data.tournaments);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTournaments();
  }, [currentPage, search]);

  const tournamentsPerPage = 2;

  return (
    <PageLayout>
      <div className="mb-10 flex items-center justify-between">
        <SearchInput value={search} onChange={setSearch} />
        <Button>+ Create Tournament</Button>
      </div>

      {isLoading ? (
        <p className="text-center py-10">Loading...</p>
      ) : !tournaments || tournaments?.length === 0 ? (
        search ? (
          <p className="text-center py-10">
            No tournaments found for "{search}"
          </p>
        ) : (
          <div className="text-center py-10 space-y-4">
            <p>No tournaments yet</p>
          </div>
        )
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3">Name</th>
                <th>Location</th>
                <th>Format</th>
                <th>Category</th>
                <th>Time Control</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tournaments?.map((tournament) => (
                <TournamentRow key={tournament.id} tournament={tournament} />
              ))}
            </tbody>
          </table>

          {totalPages <= 1 ? null : (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

// TODO:
// seed tournaments in the backend for testing
// switch to Angel's branch
// test getting tournaments with pagination and search
