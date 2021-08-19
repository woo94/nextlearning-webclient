// const ENV: string = "production"
const ENV: string = "development"

const SOCKET_SERVER_URL = ENV === "development" ? "http://localhost:8080/presence" : "https://redis-socket-fwxiejqt4q-uc.a.run.app/presence"
const PORT = 8080
const REDIS_HOST = ENV === "development" ? "127.0.0.1" : "10.55.0.3"
const REDIS_PORT = 6379

export {
    SOCKET_SERVER_URL,
    PORT,
    REDIS_HOST,
    REDIS_PORT,
}