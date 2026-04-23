import { Problem } from '../models/Problem.js';

export class DataLoader {
    constructor(sheetsDir, availableCompanies) {
        this.sheetsDir = sheetsDir;
        this.availableCompanies = availableCompanies;
    }

    async loadAll() {
        const allProblems = {};

        for (const company of this.availableCompanies) {
            const url = `${this.sheetsDir}${company}-leetcode.json`;
            console.log(`Fetching ${url}`);

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Loaded ${data.length} problems for ${company}`);
                    allProblems[company] = data.map(problemData =>
                        new Problem({ ...problemData, companies: [company] })
                    );
                } else {
                    console.warn(`Failed to load ${company} data: ${response.status}`);
                    allProblems[company] = [];
                }
            } catch (error) {
                console.error(`Error loading ${company}:`, error);
                allProblems[company] = [];
            }
        }

        return allProblems;
    }

    buildCombinedList(allProblems) {
        const problemMap = new Map();

        this.availableCompanies.forEach(company => {
            (allProblems[company] || []).forEach(problem => {
                if (problemMap.has(problem.url)) {
                    problemMap.get(problem.url).addCompany(company);
                } else {
                    problemMap.set(problem.url, problem);
                }
            });
        });

        return Array.from(problemMap.values()).sort((a, b) => {
            const countDiff = b.getCompanyCount() - a.getCompanyCount();
            if (countDiff !== 0) return countDiff;
            return a.title.localeCompare(b.title);
        });
    }
}
