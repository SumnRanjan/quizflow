
import { AllowedSubmissions, Quiz } from "../quiz";

let globalProblemId = 0;

export class QuizManager {
    private quizzes: Quiz[];

    constructor() {
        this.quizzes = [];
    }

    // Start quiz
    public start(roomId: string): void {
        const quiz = this.getQuiz(roomId);

        if (!quiz) {
            console.error("Quiz not found:", roomId);
            return;
        }

        console.log("Starting quiz:", roomId);
        quiz.start();
    }

    // Add question
    public addProblem(
        roomId: string,
        problem: {
            title: string;
            description: string;
            image?: string;
            options: { id: number; title: string }[];
            answer: AllowedSubmissions;
        }
    ): void {
        const quiz = this.getQuiz(roomId);

        if (!quiz) {
            console.error("Quiz not found:", roomId);
            return;
        }

        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: Date.now(),
            submissions: []
        });

        console.log("Question added:", problem.title);
        console.log("Total questions:", quiz.getProblemCount());
    }

    // Move to next question
    public next(roomId: string): void {
        const quiz = this.getQuiz(roomId);

        if (!quiz) {
            console.error("Quiz not found:", roomId);
            return;
        }

        console.log("Moving to next question:", roomId);
        quiz.next();
    }

    // Add student to quiz
    public addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name);
    }

    // Submit answer
    public submit(
        userId: string,
        roomId: string,
        problemId: string,
        submission: 0 | 1 | 2 | 3
    ): void {
        this.getQuiz(roomId)?.submit(
            userId,
            roomId,
            problemId,
            submission
        );
    }

    // Find quiz by room ID
    public getQuiz(roomId: string): Quiz | null {
        return this.quizzes.find(
            (quiz) => quiz.roomId === roomId
        ) ?? null;
    }

    // Get current quiz state
    public getCurrentState(roomId: string) {
        const quiz = this.getQuiz(roomId);

        if (!quiz) return null;

        return quiz.getCurrentState();
    }

    // Create quiz
    public addQuiz(roomId: string): void {
        if (this.getQuiz(roomId)) {
            console.error("Quiz already exists:", roomId);
            return;
        }

        const quiz = new Quiz(roomId);

        this.quizzes.push(quiz);

        console.log("Quiz created:", roomId);
    }
}