export class ProblemFilter {
    constructor() {
        this.difficulty = new Set();
        this.completed = null;
        this.revision = false;
        this.search = '';
    }

    reset() {
        this.difficulty.clear();
        this.completed = null;
        this.revision = false;
        this.search = '';
    }

    apply(problems, progressTracker) {
        return problems.filter(problem => {
            if (this.difficulty.size > 0 && !this.difficulty.has(problem.difficulty)) {
                return false;
            }

            const isCompleted = progressTracker.isCompleted(problem.url);

            if (this.completed === true && !isCompleted) return false;
            if (this.completed === false && isCompleted) return false;

            if (this.revision && !progressTracker.isRevision(problem.url)) return false;

            if (this.search && !problem.title.toLowerCase().includes(this.search)) {
                return false;
            }

            return true;
        });
    }
}
