import { Link } from "react-router-dom";
import {
  Zap,
  Users,
  Trophy,
  Play,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">

        <div className="flex items-center gap-2">
          <div className="bg-violet-600 p-2 rounded-xl">
            <Zap size={24} />
          </div>

          <h1 className="text-2xl font-bold">
            QuizFlow
          </h1>
        </div>

        <div className="hidden md:flex gap-8 text-gray-400">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>

        <Link
          to="/join"
          className="bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-xl"
        >
          Join Quiz
        </Link>

      </nav>

      {/* Hero Section */}
      <main id="home" className="max-w-7xl mx-auto px-8 py-24">

        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-sm mb-8">
            <Sparkles size={16} />
            Interactive Quiz Platform
          </div>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Make learning
            <span className="text-violet-500"> exciting.</span>
          </h2>

          <p className="text-gray-400 text-lg mt-6 leading-8">
            Create interactive quizzes, invite participants
            and compete with friends through live quizzes
            and real-time leaderboards.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 px-8 py-4 rounded-xl font-semibold"
            >
              Create a Quiz
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/join"
              className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold"
            >
              <Play size={18} />
              Join a Quiz
            </Link>

          </div>

        </div>

        {/* Features */}
        <div
          id="features"
          className="grid md:grid-cols-3 gap-6 mt-28"
        >

          <Feature
            icon={<Users size={28} />}
            title="Live Participation"
            description="Invite students and let everyone participate in real time."
          />

          <Feature
            icon={<Zap size={28} />}
            title="Instant Questions"
            description="Display questions instantly to everyone in your quiz room."
          />

          <Feature
            icon={<Trophy size={28} />}
            title="Live Leaderboard"
            description="Track scores and compete with other participants."
          />

        </div>

      </main>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-gray-800 text-center py-8 text-gray-500"
      >
        © 2026 QuizFlow. Make learning exciting.
      </footer>

    </div>
  );
}

function Feature({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#151B2A] border border-gray-800 p-8 rounded-2xl hover:border-violet-500 transition">

      <div className="text-violet-400 mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-400 leading-7">
        {description}
      </p>

    </div>
  );
}