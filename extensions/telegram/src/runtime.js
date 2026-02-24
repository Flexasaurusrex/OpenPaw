let runtime = null;
export function setTelegramRuntime(next) {
    runtime = next;
}
export function getTelegramRuntime() {
    if (!runtime) {
        throw new Error("Telegram runtime not initialized");
    }
    return runtime;
}
