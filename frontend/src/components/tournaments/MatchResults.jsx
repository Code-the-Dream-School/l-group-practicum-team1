import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import "./MatchResults.css";

const scoreOptions = ["0", "0.5", "1"];

export default function MatchResults({ matches }) {
  console.log("GET matches", matches);
  // Initialize matches with original values
  const [roundMatches, setRoundMatches] = useState(
    matches.map((m) => ({
      ...m,
      originalPlayer1Score: m.player1Score ?? "0",
      originalPlayer2Score: m.player2Score ?? "0",
    })),
  );

  useEffect(() => {
    setRoundMatches(
      matches.map((m) => ({
        ...m,
        originalPlayer1Score: m.player1Score ?? "0",
        originalPlayer2Score: m.player2Score ?? "0",
      })),
    );
  }, [matches]);

  function isMatchChanged(match) {
    return (
      match.player1Score !== match.originalPlayer1Score ||
      match.player2Score !== match.originalPlayer2Score
    );
  }

  function getOppositeScore(score) {
    if (score === "1") return "0";
    if (score === "0") return "1";
    if (score === "0.5") return "0.5";

    return "0";
  }

  function handleScoreChange(matchId, field, value) {
    setRoundMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match;

        if (field === "player1Score") {
          return {
            ...match,
            player1Score: value,
            player2Score: getOppositeScore(value),
          };
        }

        if (field === "player2Score") {
          return {
            ...match,
            player2Score: value,
            player1Score: getOppositeScore(value),
          };
        }

        return match;
      }),
    );
  }

  function isMatchFinished(match) {
    const s1 = Number(match.player1Score);
    const s2 = Number(match.player2Score);

    return s1 + s2 === 1; // valid chess result only, not 0:0
  }

  function getWinnerPlayerId(match) {
    if (!isMatchFinished(match)) return null;

    const player1Score = Number(match.player1Score);
    const player2Score = Number(match.player2Score);

    if (player1Score > player2Score) return match.player1Id;
    if (player2Score > player1Score) return match.player2Id;

    // draw: winner is the player with black pieces
    if (match.player1Color === "BLACK") return match.player1Id;
    if (match.player2Color === "BLACK") return match.player2Id;

    return null;
  }

  async function handleSaveMatch(match) {
    const payload = {
      player1Score: Number(match.player1Score),
      player2Score: Number(match.player2Score),
      winnerPlayerId: getWinnerPlayerId(match),
    };
    console.log("send to backend:", payload);

    // TODO: await fetch match

    // reset after save
    setRoundMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? {
              ...m,
              originalPlayer1Score: m.player1Score,
              originalPlayer2Score: m.player2Score,
            }
          : m,
      ),
    );
  }
  return (
    <div className="match-results">
      {!matches ? (
        <p>Loading matches...</p>
      ) : (
        roundMatches.map((match) => (
          <div key={match.id} className="match-row">
            <div
              className={`player-name ${
                getWinnerPlayerId(match) === match.player1Id ? "winner" : ""
              }`}
            >
              <span
                className={`color-indicator ${
                  // match.player1Color === "BLACK" ? "BLACK" : "WHITE"
                  match.player1Color === "BLACK" ? "black" : "white"
                }`}
              />
              {match.player1Id}
            </div>

            <div className="score-controls">
              <select
                value={match.player1Score ?? "0"}
                onChange={(e) =>
                  handleScoreChange(match.id, "player1Score", e.target.value)
                }
              >
                {scoreOptions.map((score) => (
                  <option key={score} value={score}>
                    {score === "0.5" ? "1/2" : score}
                  </option>
                ))}
              </select>

              <span>-</span>

              <select
                value={match.player2Score ?? "0"}
                onChange={(e) =>
                  handleScoreChange(match.id, "player2Score", e.target.value)
                }
              >
                {scoreOptions.map((score) => (
                  <option key={score} value={score}>
                    {score === "0.5" ? "1/2" : score}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`player-name ${
                getWinnerPlayerId(match) === match.player2Id ? "winner" : ""
              }`}
            >
              <span
                className={`color-indicator ${
                  match.player2Color === "BLACK" ? "black" : "white"
                }`}
              />
              {match.player2Id}
            </div>

            <Button
              disabled={!isMatchChanged(match)}
              onClick={() => handleSaveMatch(match)}
            >
              Save
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
