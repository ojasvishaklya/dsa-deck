export class Problem {
    constructor(data) {
        this.title = data.title;
        this.platform = data.platform || 'LeetCode';
        this.difficulty = data.difficulty;
        this.url = data.url;
        this.notes = data.notes;
        this.primaryTopic = data.primaryTopic;
        this.pattern = data.pattern;
        this.companies = data.companies || [];
        this.frequency = data.metadata?.frequency || null;
    }

    addCompany(company) {
        if (!this.companies.includes(company)) {
            this.companies.push(company);
        }
    }

    hasCompany(company) {
        return this.companies.includes(company);
    }

    getCompanyCount() {
        return this.companies.length;
    }
}
