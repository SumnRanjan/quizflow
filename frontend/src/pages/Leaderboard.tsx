import { Link } from "react-router-dom";
import {
  Zap,
  Trophy,
  Crown,
  Medal,
  ArrowLeft,
  RefreshCw,
  Users,
} from "lucide-react";

type Player = {
  id: string;
  name: string;
  points: number;
};

const players: Player[] = [
  { id: "1", name: "Rahul", points: 950 },
  { id: "2", name: "Suman", points: 850 },
  { id: "3", name: "Priya", points: 750 },
  { id: "4", name: "Amit", points: 600 },
  { id: "5", name: "Neha", points: 450 },
];

function Leaderboard() {
  const sortedPlayers = [...players].sort(
    (a, b) => b.points - a.points
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-violet-400" />
          QuizFlow
        </Link>

        <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
          Quiz completed
        </span>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">
        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">
            <Trophy size={32} className="text-yellow-400" />
          </div>

          <p className="text-sm font-semibold tracking-widest text-violet-400">
            QUIZ RESULTS
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Final Leaderboard
          </h1>

          <p className="mt-3 text-gray-400">
            Congratulations to everyone who participated!
          </p>
        </div>

        {/* Winner */}
        {sortedPlayers.length > 0 && (
          <section className="mb-10 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-violet-500/10 p-8 text-center">
            <Crown size={42} className="mx-auto mb-4 text-yellow-400" />

            <p className="text-sm font-semibold tracking-widest text-yellow-400">
              QUIZ CHAMPION
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {sortedPlayers[0].name}
            </h2>

            <p className="mt-2 text-4xl font-bold text-yellow-400">
              {sortedPlayers[0].points}
              <span className="ml-2 text-base font-normal text-gray-400">
                points
              </span>
            </p>
          </section>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 text-gray-400">
              <Users size={20} />
              Participants
            </div>
            <p className="mt-3 text-3xl font-bold">
              {sortedPlayers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 text-gray-400">
              <Trophy size={20} />
              Highest score
            </div>
            <p className="mt-3 text-3xl font-bold">
              {sortedPlayers[0]?.points ?? 0}
            </p>
          </div>
        </div>

        {/* Rankings */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-xl font-semibold">Player rankings</h2>
          </div>

          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between border-b border-white/10 p-5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-bold">
                  {index === 0 ? (
                    <Crown className="text-yellow-400" />
                  ) : index === 1 ? (
                    <Medal className="text-gray-300" />
                  ) : index === 2 ? (
                    <Medal className="text-orange-400" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-gray-500">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>

              <p className="font-bold tabular-nums">
                {player.points} pts
              </p>
            </div>
          ))}
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500"
          >
            <RefreshCw size={18} />
            Back to dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;