export class ProgressTracker {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    save(progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    getKey(company, problemUrl) {
        return `${company}:${problemUrl}`;
    }

    isCompleted(company, problemUrl) {
        const progress = this.load();
        const key = this.getKey(company, problemUrl);
        return progress[key] || false;
    }

    toggleCompletion(company, problemUrl, isCompleted) {
        const progress = this.load();
        const key = this.getKey(company, problemUrl);
        progress[key] = isCompleted;
        this.save(progress);
    }

    getCompletedCount(problems, company) {
        const progress = this.load();
        return problems.filter(problem => {
            if (company === 'all') {
                return problem.companies.some(c => {
                    const key = this.getKey(c, problem.url);
                    return progress[key];
                });
            } else {
                const key = this.getKey(company, problem.url);
                return progress[key];
            }
        }).length;
    }
}
