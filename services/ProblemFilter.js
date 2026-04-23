export class ProblemFilter {
    constructor() {
        this.difficulty = new Set();
        this.completed = null;
        this.search = '';
    }

    reset() {
        this.difficulty.clear();
        this.completed = null;
        this.search = '';
    }

    apply(problems, currentCompany, progressTracker) {
        const progress = progressTracker.load();

        return problems.filter(problem => {
            if (this.difficulty.size > 0 && !this.difficulty.has(problem.difficulty)) {
                return false;
            }

            let isCompleted;
            if (currentCompany === 'all') {
                isCompleted = problem.companies.some(company => {
                    const key = progressTracker.getKey(company, problem.url);
                    return progress[key];
                });
            } else {
                const key = progressTracker.getKey(currentCompany, problem.url);
                isCompleted = progress[key] || false;
            }

            if (this.completed === true && !isCompleted) return false;
            if (this.completed === false && isCompleted) return false;

            if (this.search && !problem.title.toLowerCase().includes(this.search)) {
                return false;
            }

            return true;
        });
    }
}
