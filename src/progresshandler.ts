export interface ProgressHandler {
    onProgress(stage: number): void;
}

class EmptyHandler implements ProgressHandler {
    onProgress(_stage: number): void {}
}

export {
    EmptyHandler
}
