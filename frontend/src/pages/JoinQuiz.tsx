import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Users, ArrowRight } from "lucide-react";

function JoinQuiz() {
  const [name, setName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !quizCode.trim()) {
      alert("Please enter your name and quiz code");
      return;
    }

    // We'll connect this page to Socket.IO later.
    navigate(`/play?name=${encodeURIComponent(name)}&code=${encodeURIComponent(quizCode)}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-violet-400" />
          QuizFlow
        </Link>

        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15">
              <Users size={30} className="text-violet-400" />
            </div>

            <h1 className="text-3xl font-bold">Join a quiz</h1>
            <p className="mt-3 text-gray-400">
              Enter your details to join the live session.
            </p>
          </div>

          <form
            onSubmit={handleJoin}
            className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl"
          >
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your nickname"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Quiz code
              </label>
              <input
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value)}
                placeholder="e.g. QUIZ123"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 uppercase tracking-widest outline-none transition focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500"
            >
              Join session
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs text-gray-500">
              Make sure you have the correct quiz code from your host.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default JoinQuiz;