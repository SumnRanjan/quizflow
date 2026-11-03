import { Link } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  Plus,
  Users,
  Trophy,
  Play,
  Settings,
  LogOut,
  ArrowUpRight,
  Clock,
  BookOpen,
} from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#0E1422] p-6 md:flex">
          <Link to="/" className="mb-12 flex items-center gap-2 text-xl font-bold">
            <Zap className="text-violet-400" />
            QuizFlow
          </Link>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl bg-violet-500/15 px-4 py-3 text-left text-violet-300">
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-400 hover:bg-white/5 hover:text-white">
              <BookOpen size={19} />
              My quizzes
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-400 hover:bg-white/5 hover:text-white">
              <Trophy size={19} />
              Leaderboard
            </button>
          </nav>

          <div className="mt-auto space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white">
              <Settings size={19} />
              Settings
            </button>

            <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white">
              <LogOut size={19} />
              Back to home
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10">
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Workspace / Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold">Welcome back, Host 👋</h1>
              <p className="mt-2 text-gray-400">
                Manage your quizzes and host live sessions.
              </p>
            </div>

            <Link
              to="/admin/create"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
            >
              <Plus size={19} />
              Create quiz
            </Link>
          </header>

          {/* Stats */}
          <section className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total quizzes"
              value="12"
              icon={<BookOpen />}
              description="All created quizzes"
            />
            <StatCard
              title="Total participants"
              value="248"
              icon={<Users />}
              description="Across all sessions"
            />
            <StatCard
              title="Live sessions"
              value="0"
              icon={<Play />}
              description="Currently running"
            />
          </section>

          {/* Quick actions */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-semibold">Quick actions</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <ActionCard
                icon={<Plus size={23} />}
                title="Create a new quiz"
                description="Add questions and prepare your next quiz."
                link="/admin/create"
              />

              <ActionCard
                icon={<Play size={23} />}
                title="Host a live session"
                description="Start a quiz and invite participants."
                link="/admin"
              />
            </div>
          </section>

          {/* Recent quizzes */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent quizzes</h2>
              <button className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300">
                View all <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <QuizRow
                title="JavaScript Fundamentals"
                questions={15}
                participants={42}
                status="Completed"
              />
              <QuizRow
                title="React Basics"
                questions={10}
                participants={28}
                status="Completed"
              />
              <QuizRow
                title="Node.js Assessment"
                questions={20}
                participants={0}
                status="Draft"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, link }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/50 hover:bg-violet-500/5"
    >
      <div className="mb-5 inline-flex rounded-xl bg-violet-500/15 p-3 text-violet-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
      <div className="mt-5 flex items-center gap-2 text-sm text-violet-400">
        Open <ArrowUpRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function QuizRow({ title, questions, participants, status }: {
  title: string;
  questions: number;
  participants: number;
  status: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 last:border-0">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {questions} questions · {participants} participants
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className={`rounded-full px-3 py-1 text-xs ${
          status === "Completed"
            ? "bg-green-500/10 text-green-400"
            : "bg-yellow-500/10 text-yellow-400"
        }`}>
          {status}
        </span>
        <Clock size={18} className="text-gray-500" />
      </div>
    </div>
  );
}

export default AdminDashboard;