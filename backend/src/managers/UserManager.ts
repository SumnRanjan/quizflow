
import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "ADMIN_PASSWORD";

export class UserManager {
    private quizManager: QuizManager;
    private adminRooms: Map<string, Set<string>>;

    constructor() {
        this.quizManager = new QuizManager();
        this.adminRooms = new Map();
    }

    addUser(socket: Socket) {
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {

        // Student joins a quiz
        socket.on("join", (data: { roomId: string; name: string }) => {
            const userId = this.quizManager.addUser(
                data.roomId,
                data.name
            );

            if (!userId) {
                socket.emit("joinError", {
                    message: "Quiz room not found"
                });
                return;
            }

            socket.join(data.roomId);

            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });

            console.log(`${data.name} joined room ${data.roomId}`);
        });

        // Admin authentication
        socket.on("joinAdmin", (data: { password: string }) => {

            if (data.password !== ADMIN_PASSWORD) {
                socket.emit("adminError", {
                    message: "Invalid admin password"
                });
                return;
            }

            socket.data.isAdmin = true;

            console.log("Admin connected:", socket.id);

            socket.emit("adminAuthenticated");
        });

        // Create quiz room
        socket.on("createQuiz", () => {

            if (!socket.data.isAdmin) {
                socket.emit("adminError", {
                    message: "Admin authentication required"
                });
                return;
            }

            let roomId = "";

            do {
                roomId = Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();

            } while (this.quizManager.getQuiz(roomId));

            this.quizManager.addQuiz(roomId);

            socket.join(roomId);

            const rooms = this.adminRooms.get(socket.id) ?? new Set<string>();
            rooms.add(roomId);
            this.adminRooms.set(socket.id, rooms);

            socket.emit("quizCreated", {
                roomId
            });

            console.log("Quiz created:", roomId);
        });

        // Add question
        socket.on("createProblem", (data) => {

            if (
                !socket.data.isAdmin ||
                !this.adminRooms.get(socket.id)?.has(data.roomId)
            ) {
                socket.emit("adminError", {
                    message: "You are not authorized to edit this quiz"
                });
                return;
            }

            this.quizManager.addProblem(
                data.roomId,
                data.problem
            );

            console.log("Question added:", data.problem.title);
        });

        // Start quiz
        socket.on("start", (data: { roomId: string }) => {

            if (
                !socket.data.isAdmin ||
                !this.adminRooms.get(socket.id)?.has(data.roomId)
            ) {
                socket.emit("adminError", {
                    message: "You are not authorized to start this quiz"
                });
                return;
            }

            console.log("Starting quiz:", data.roomId);

            this.quizManager.start(data.roomId);
        });

        // Move to next question
        socket.on("next", (data: { roomId: string }) => {

            if (
                !socket.data.isAdmin ||
                !this.adminRooms.get(socket.id)?.has(data.roomId)
            ) {
                socket.emit("adminError", {
                    message: "You are not authorized to control this quiz"
                });
                return;
            }

            console.log("Moving to next question:", data.roomId);

            this.quizManager.next(data.roomId);
        });

        // Submit answer
        socket.on("submit", (data) => {

            const {
                userId,
                problemId,
                submission,
                roomId
            } = data;

            if (
                submission !== 0 &&
                submission !== 1 &&
                submission !== 2 &&
                submission !== 3
            ) {
                console.error("Invalid submission:", submission);
                return;
            }

            this.quizManager.submit(
                userId,
                roomId,
                problemId,
                submission
            );
        });

        // Clean up admin room tracking on disconnect
        socket.on("disconnect", () => {
            this.adminRooms.delete(socket.id);
            console.log("Socket disconnected:", socket.id);
        });
    }
}
