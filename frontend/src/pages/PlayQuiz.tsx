
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { socket } from "../lib/socket";
import {
  Zap,
  Clock,
  CheckCircle2,
  Send,
  Trophy,
  Wifi,
  WifiOff,
} from "lucide-react";

type Option = {
  id: number;
  title: string;
};

type Question = {
  id: string;
  title: string;
  description: string;
  options: Option[];
  startTime: number;
};

type Player = {
  id: string;
  name: string;
  points: number;
};

function PlayQuiz() {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name") || "Student";
  const roomId = searchParams.get("code") || "";

  const [userId, setUserId] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "waiting" | "question" | "leaderboard" | "error"
  >("connecting");
  const [connected, setConnected] = useState(false);

  // Connect student to quiz room
  useEffect(() => {
    if (!roomId) {
      setStatus("error");
      return;
    }

    const handleConnect = () => {
      setConnected(true);

      socket.emit("join", {
        roomId,
        name,
      });
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleInit = (data: {
      userId: string;
      state: {
        type: string;
        problem?: Question;
        leaderboard?: Player[];
      } | null;
    }) => {
      if (!data.userId || !data.state) {
        setStatus("error");
        return;
      }

      setUserId(data.userId);

      if (data.state.type === "question" && data.state.problem) {
        setQuestion(data.state.problem);
        setSelectedAnswer(null);
        setSubmitted(false);
        setTimeLeft(20);
        setStatus("question");
      } else if (data.state.type === "leaderboard") {
        setLeaderboard(data.state.leaderboard || []);
        setStatus("leaderboard");
      } else if (data.state.type === "not_started") {
        setStatus("waiting");
      } else {
        setStatus("waiting");
      }
    };

    // Receive a new question
    const handleProblem = (data: { problem: Question }) => {
      setQuestion(data.problem);
      setSelectedAnswer(null);
      setSubmitted(false);
      setTimeLeft(20);
      setStatus("question");
    };

    // Receive leaderboard
    const handleLeaderboard = (data: {
      leaderboard: Player[];
    }) => {
      setLeaderboard(data.leaderboard);
      setStatus("leaderboard");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("init", handleInit);
    socket.on("problem", handleProblem);
    socket.on("leaderboard", handleLeaderboard);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("init", handleInit);
      socket.off("problem", handleProblem);
      socket.off("leaderboard", handleLeaderboard);
      socket.disconnect();
    };
  }, [roomId, name]);

  // Countdown timer
  useEffect(() => {
    if (status !== "question" || submitted || timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submitted, status]);

  // Submit answer to backend
  const handleSubmit = () => {
    if (
      selectedAnswer === null ||
      !userId ||
      !question ||
      submitted ||
      timeLeft <= 0
    ) {
      return;
    }

    socket.emit("submit", {
      userId,
      problemId: question.id,
      submission: selectedAnswer,
      roomId,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-violet-400" />
          QuizFlow
        </Link>

        <div className="text-sm text-gray-400">
          Quiz code:{" "}
          <span className="font-semibold text-white">{roomId}</span>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm">
          {connected ? (
            <Wifi size={16} className="text-green-400" />
          ) : (
            <WifiOff size={16} className="text-red-400" />
          )}
          {name}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">

        {/* Connecting */}
        {status === "connecting" && (
          <div className="py-20 text-center text-gray-400">
            Connecting to quiz...
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <h2 className="text-xl font-bold text-red-400">
              Unable to join quiz
            </h2>
            <p className="mt-3 text-gray-400">
              Check the room code and make sure the quiz exists.
            </p>
          </div>
        )}

        {/* Waiting */}
        {status === "waiting" && (
          <div className="py-20 text-center">
            <Clock size={48} className="mx-auto text-violet-400" />

            <h1 className="mt-6 text-3xl font-bold">
              You're in the quiz!
            </h1>

            <p className="mt-3 text-gray-400">
              Waiting for the host to start the quiz...
            </p>

            <div className="mt-6 inline-block rounded-xl bg-violet-500/10 px-5 py-3 text-violet-300">
              Room: {roomId}
            </div>
          </div>
        )}

        {/* Question */}
        {status === "question" && question && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Live question
              </span>

              <div className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2 text-violet-300">
                <Clock size={18} />
                <span className="font-bold tabular-nums">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Timer progress */}
            <div className="mb-10 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${(timeLeft / 20) * 100}%` }}
              />
            </div>

            {/* Actual backend question */}
            <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <p className="mb-4 text-sm font-semibold text-violet-400">
                QUIZ QUESTION
              </p>

              <h1 className="text-2xl font-bold leading-relaxed md:text-3xl">
                {question.title}
              </h1>

              <p className="mt-4 text-gray-400">
                {question.description}
              </p>
            </section>

            {/* Actual backend options */}
            <div className="grid gap-4 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const selected = selectedAnswer === option.id;

                return (
                  <button
                    key={option.id}
                    disabled={submitted || timeLeft === 0}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={`flex min-h-20 items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-violet-400 bg-violet-500/15"
                        : "border-white/10 bg-white/[0.03] hover:border-violet-400/50"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="font-medium">
                      {option.title}
                    </span>

                    {selected && (
                      <CheckCircle2 className="ml-auto text-violet-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || timeLeft === 0}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
                Submit answer
              </button>
            ) : (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
                <Trophy className="mx-auto mb-3 text-yellow-400" size={32} />

                <h2 className="text-xl font-bold">
                  Answer submitted!
                </h2>

                <p className="mt-2 text-gray-400">
                  Wait for the host to show the leaderboard.
                </p>
              </div>
            )}

            {timeLeft === 0 && !submitted && (
              <p className="mt-5 text-center text-red-400">
                Time is up!
              </p>
            )}
          </>
        )}

        {/* Leaderboard */}
        {status === "leaderboard" && (
          <section>
            <div className="mb-8 text-center">
              <Trophy
                size={48}
                className="mx-auto text-yellow-400"
              />

              <h1 className="mt-4 text-3xl font-bold">
                Leaderboard
              </h1>

              <p className="mt-2 text-gray-400">
                Current quiz rankings
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              {leaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between border-b border-white/10 p-5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-violet-400">
                      #{index + 1}
                    </span>

                    <span className="font-semibold">
                      {player.name}
                    </span>
                  </div>

                  <span className="font-bold">
                    {player.points} pts
                  </span>
                </div>
              ))}

              {leaderboard.length === 0 && (
                <p className="p-6 text-center text-gray-400">
                  No leaderboard data yet.
                </p>
              )}
            </div>

            <p className="mt-6 text-center text-gray-400">
              Waiting for the host to start the next question...
            </p>
          </section>
        )}

      </main>
    </div>
  );
}

export default PlayQuiz;
