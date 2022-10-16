

export class IPAnim {

    progress: number;
    start() {};
    stop() {};
    setProgress(percent: number) {
        this.progress = percent;
    };
    getProgress(): number {
        return this.progress
    };
    updateString() {}

}
