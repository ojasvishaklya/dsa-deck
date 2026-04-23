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

    getEntry(problemUrl) {
        const progress = this.load();
        return progress[problemUrl] || { completed: false, revision: false };
    }

    isCompleted(problemUrl) {
        return this.getEntry(problemUrl).completed;
    }

    isRevision(problemUrl) {
        return this.getEntry(problemUrl).revision;
    }

    toggleCompletion(problemUrl, isCompleted) {
        const progress = this.load();
        const entry = progress[problemUrl] || { completed: false, revision: false };
        entry.completed = isCompleted;
        progress[problemUrl] = entry;
        this.save(progress);
    }

    toggleRevision(problemUrl) {
        const progress = this.load();
        const entry = progress[problemUrl] || { completed: false, revision: false };
        entry.revision = !entry.revision;
        progress[problemUrl] = entry;
        this.save(progress);
    }

    getCompletedCount(problems) {
        const progress = this.load();
        return problems.filter(p => progress[p.url]?.completed).length;
    }

    getRevisionCount(problems) {
        const progress = this.load();
        return problems.filter(p => progress[p.url]?.revision).length;
    }
}
