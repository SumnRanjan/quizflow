
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../lib/socket";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Zap,
  CheckCircle2,
  Copy,
  Users,
  Wifi,
  WifiOff,
  Play,
} from "lucide-react";

type Question = {
  id: number;
  title: string;
  description: string;
  options: string[];
  answer: number;
};

function CreateQuiz() {
  // Quiz information
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      title: "",
      description: "",
      options: ["", "", "", ""],
      answer: -1,
    },
  ]);

  // Socket and room states
  const [roomId, setRoomId] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [socketError, setSocketError] = useState("");

  // Reference for automatic scrolling
  const roomSectionRef = useRef<HTMLElement | null>(null);

  // Automatically scroll to room code after quiz creation
  useEffect(() => {
    if (roomId && roomSectionRef.current) {
      roomSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [roomId]);

  // Connect to backend
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to backend:", socket.id);

      setSocketConnected(true);
      setSocketError("");

      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD",
      });
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
      setSocketConnected(false);
      setSocketError("Unable to connect to backend.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, []);

  // Add question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      title: "",
      description: "",
      options: ["", "", "", ""],
      answer: -1,
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  // Remove question
  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Update question title or description
  const updateQuestion = (
    id: number,
    field: "title" | "description",
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  // Update option
  const updateOption = (
    id: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : q
      )
    );
  };

  // Select correct answer
  const updateAnswer = (id: number, answer: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, answer } : q
      )
    );
  };

  // Create quiz
  const handleSave = () => {
    if (!socketConnected) {
      setSocketError(
        "Backend is not connected. Start your backend first."
      );
      return;
    }

    if (!quizTitle.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const invalidQuestion = questions.some(
      (q) =>
        !q.title.trim() ||
        q.options.some((option) => !option.trim()) ||
        q.answer < 0 ||
        q.answer > 3
    );

    if (invalidQuestion) {
      alert(
        "Please complete every question, all four options, and select the correct answer."
      );
      return;
    }

    setCreating(true);
    setSocketError("");

    // eslint-disable-next-line prefer-const
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleQuizCreated = ({
      roomId: newRoomId,
    }: {
      roomId: string;
    }) => {
      clearTimeout(timeoutId);

      console.log("Room created:", newRoomId);

      // Update room ID.
      // This triggers the scrolling useEffect above.
      setRoomId(newRoomId);

      // Send questions to backend
      questions.forEach((question) => {
        socket.emit("createProblem", {
          roomId: newRoomId,
          problem: {
            title: question.title,
            description: question.description,
            options: question.options.map((option, index) => ({
              id: index,
              title: option,
            })),
            answer: question.answer,
          },
        });
      });

      setCreating(false);

      console.log("All questions sent to backend");
    };

    socket.once("quizCreated", handleQuizCreated);

    // Request backend to create a room
    socket.emit("createQuiz");

    // Timeout if backend does not respond
    timeoutId = setTimeout(() => {
      socket.off("quizCreated", handleQuizCreated);
      setCreating(false);
      setSocketError(
        "No response from backend. Please try again."
      );
    }, 10000);
  };

  // Copy room code
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room code copied!");
    } catch {
      alert("Unable to copy room code. Please copy it manually.");
    }
  };

  // Start quiz
  const handleStartQuiz = () => {
    if (!roomId || !socketConnected || quizStarted) return;

    socket.emit("start", { roomId });
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="flex items-center gap-2 text-lg font-bold">
          <Zap className="text-violet-400" />
          QuizFlow
        </div>

        <div className="flex flex-wrap items-center gap-4">

          {/* Connection status */}
          <div className="flex items-center gap-2 text-sm">
            {socketConnected ? (
              <>
                <Wifi size={17} className="text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={17} className="text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!socketConnected || creating || !!roomId}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            {creating
              ? "Creating..."
              : roomId
                ? "Quiz created"
                : "Save quiz"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">

        {/* Room Code and Start Quiz - TOP SECTION */}
        {roomId && (
          <section
            ref={roomSectionRef}
            className="mb-8 scroll-mt-6 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6"
          >

            <div className="flex flex-wrap items-center justify-between gap-5">

              <div>
                <p className="text-sm font-semibold text-violet-300">
                  QUIZ ROOM CODE
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-widest">
                    {roomId}
                  </h2>

                  <button
                    onClick={copyRoomCode}
                    className="rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
                    title="Copy room code"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  Share this code with participants to join your quiz.
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={quizStarted || !socketConnected}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quizStarted ? (
                  <>
                    <CheckCircle2 size={18} />
                    Quiz Started
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Start Quiz
                  </>
                )}
              </button>

            </div>

            {quizStarted && (
              <div className="mt-5 flex items-center gap-2 border-t border-violet-500/20 pt-4 text-sm text-green-400">
                <CheckCircle2 size={17} />
                Quiz started. Participants can now answer questions.
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
              <Users size={18} />
              Students can join using the room code above.
            </div>

          </section>
        )}

        {/* Page heading */}
        <div className="mb-10">
          <p className="text-sm text-violet-400">
            QUIZ BUILDER
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Create your quiz
          </h1>

          <p className="mt-2 text-gray-400">
            Add questions and prepare an engaging quiz for your participants.
          </p>
        </div>

        {/* Error message */}
        {socketError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {socketError}
          </div>
        )}

        {/* Quiz information */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Basic information
          </h2>

          <label className="mb-2 block text-sm text-gray-300">
            Quiz title
          </label>

          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="e.g. JavaScript Fundamentals"
            disabled={!!roomId}
            className="mb-5 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-violet-500 disabled:opacity-60"
          />

          <label className="mb-2 block text-sm text-gray-300">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quiz about?"
            rows={3}
            disabled={!!roomId}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-violet-500 disabled:opacity-60"
          />
        </section>

        {/* Questions heading */}
        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Questions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {questions.length} questions added
            </p>
          </div>

          <button
            onClick={addQuestion}
            disabled={!!roomId}
            className="flex items-center gap-2 rounded-xl border border-violet-500/40 px-4 py-2.5 text-violet-300 transition hover:bg-violet-500/10 disabled:opacity-40"
          >
            <Plus size={18} />
            Add question
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-6">

          {questions.map((question, questionIndex) => (

            <section
              key={question.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >

              {/* Question heading */}
              <div className="mb-6 flex items-center justify-between">

                <h3 className="font-semibold">
                  Question {questionIndex + 1}
                </h3>

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(question.id)}
                    disabled={!!roomId}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                    aria-label={`Remove question ${questionIndex + 1}`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Question title */}
              <label className="mb-2 block text-sm text-gray-300">
                Question title
              </label>

              <input
                value={question.title}
                disabled={!!roomId}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Enter your question"
                className="mb-4 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-violet-500 disabled:opacity-60"
              />

              {/* Question description */}
              <label className="mb-2 block text-sm text-gray-300">
                Description (optional)
              </label>

              <textarea
                value={question.description}
                disabled={!!roomId}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Add some context..."
                rows={2}
                className="mb-6 w-full resize-none rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-violet-500 disabled:opacity-60"
              />

              {/* Answer options */}
              <div className="mb-3 flex items-center justify-between">

                <label className="text-sm text-gray-300">
                  Answer options
                </label>

                <span className="text-xs text-gray-500">
                  Select the correct answer
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {question.options.map((option, optionIndex) => (

                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      question.answer === optionIndex
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-white/10 bg-[#111827]"
                    }`}
                  >

                    {/* Correct answer selection */}
                    <button
                      type="button"
                      disabled={!!roomId}
                      onClick={() =>
                        updateAnswer(
                          question.id,
                          optionIndex
                        )
                      }
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                        question.answer === optionIndex
                          ? "border-green-400 bg-green-500 text-white"
                          : "border-gray-600 text-gray-400"
                      }`}
                      aria-label={`Mark option ${optionIndex + 1} as correct`}
                    >
                      {question.answer === optionIndex && (
                        <CheckCircle2 size={17} />
                      )}
                    </button>

                    {/* Option input */}
                    <input
                      value={option}
                      disabled={!!roomId}
                      onChange={(e) =>
                        updateOption(
                          question.id,
                          optionIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-60"
                    />

                  </div>
                ))}

              </div>

              <p className="mt-4 text-xs text-gray-500">
                Green indicates the selected correct answer.
              </p>

            </section>
          ))}

        </div>

        {/* Bottom Save Quiz button */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

          <p className="text-sm text-gray-500">
            {questions.length} questions · 4 options each
          </p>

          <button
            onClick={handleSave}
            disabled={!socketConnected || creating || !!roomId}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {creating
              ? "Creating quiz..."
              : roomId
                ? "Quiz created"
                : "Save quiz"}
          </button>

        </div>

      </main>
    </div>
  );
}

export default CreateQuiz;
