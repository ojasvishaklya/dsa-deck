export class UIRenderer {
    constructor() {
        this.elements = {
            companyTabs: document.getElementById('company-tabs'),
            problemsList: document.getElementById('problems-list'),
            totalProblems: document.getElementById('total-problems'),
            completedProblems: document.getElementById('completed-problems'),
            revisionCount: document.getElementById('revision-count'),
            search: document.getElementById('search'),
            easyCount: document.getElementById('easy-count'),
            mediumCount: document.getElementById('medium-count'),
            hardCount: document.getElementById('hard-count'),
            easyProgress: document.getElementById('easy-progress'),
            mediumProgress: document.getElementById('medium-progress'),
            hardProgress: document.getElementById('hard-progress')
        };
    }

    renderCompanyTabs(availableCompanies, allProblems, totalCount) {
        this.elements.companyTabs.innerHTML = `
            <button class="company-tab" data-company="all">
                All Questions <span class="tab-count">${totalCount}</span>
            </button>
            ${availableCompanies.map(company => {
                const count = (allProblems[company] || []).length;
                return `<button class="company-tab" data-company="${company}">
                    ${this.formatSheetName(company)} <span class="tab-count">${count}</span>
                </button>`;
            }).join('')}
        `;
    }

    renderStats(totalCount, completedCount, revisionCount, problems, progressTracker) {
        this.elements.totalProblems.textContent = totalCount;
        this.elements.completedProblems.textContent = completedCount;
        this.elements.revisionCount.textContent = revisionCount;

        // Calculate difficulty breakdown
        const easyProblems = problems.filter(p => p.difficulty === 'Easy');
        const mediumProblems = problems.filter(p => p.difficulty === 'Medium');
        const hardProblems = problems.filter(p => p.difficulty === 'Hard');

        const easyCompleted = easyProblems.filter(p => progressTracker.isCompleted(p.url)).length;
        const mediumCompleted = mediumProblems.filter(p => progressTracker.isCompleted(p.url)).length;
        const hardCompleted = hardProblems.filter(p => progressTracker.isCompleted(p.url)).length;

        this.elements.easyCount.textContent = `${easyCompleted}/${easyProblems.length}`;
        this.elements.mediumCount.textContent = `${mediumCompleted}/${mediumProblems.length}`;
        this.elements.hardCount.textContent = `${hardCompleted}/${hardProblems.length}`;

        // Update progress bars
        const easyPercent = easyProblems.length > 0 ? (easyCompleted / easyProblems.length) * 100 : 0;
        const mediumPercent = mediumProblems.length > 0 ? (mediumCompleted / mediumProblems.length) * 100 : 0;
        const hardPercent = hardProblems.length > 0 ? (hardCompleted / hardProblems.length) * 100 : 0;

        this.elements.easyProgress.style.width = `${easyPercent}%`;
        this.elements.mediumProgress.style.width = `${mediumPercent}%`;
        this.elements.hardProgress.style.width = `${hardPercent}%`;
    }

    renderProblems(filteredProblems, currentCompany, progressTracker) {
        if (filteredProblems.length === 0) {
            this.elements.problemsList.innerHTML = `
                <div class="empty-state">
                    <h3>No problems found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        this.elements.problemsList.innerHTML = filteredProblems.map((problem, index) => {
            const isCompleted = progressTracker.isCompleted(problem.url);
            const isRevision = progressTracker.isRevision(problem.url);

            const companyBadges = currentCompany === 'all'
                ? `<div class="company-badges">${problem.companies.map(c =>
                    `<span class="company-badge ${c}">${this.capitalize(c)}</span>`
                  ).join('')}</div>`
                : '';

            return `
                <div class="problem-item ${isCompleted ? 'completed' : ''}" data-url="${problem.url}">
                    <span class="problem-number">#${index + 1}</span>
                    <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
                    <button class="star-btn ${isRevision ? 'active' : ''}" title="Mark as important">&#9733;</button>
                    <div class="problem-title">
                        <a href="${problem.url}" target="_blank">${problem.title}</a>
                    </div>
                    <div class="problem-meta">
                        ${companyBadges}
                        <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderGroupedProblems(filteredProblems, currentCompany, progressTracker) {
        if (filteredProblems.length === 0) {
            this.elements.problemsList.innerHTML = `
                <div class="empty-state">
                    <h3>No problems found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        // Group problems by primaryTopic
        const groupedProblems = {};
        filteredProblems.forEach(problem => {
            const topic = problem.primaryTopic || 'Uncategorized';
            if (!groupedProblems[topic]) {
                groupedProblems[topic] = [];
            }
            groupedProblems[topic].push(problem);
        });

        // Sort topics alphabetically
        const sortedTopics = Object.keys(groupedProblems).sort();

        this.elements.problemsList.innerHTML = sortedTopics.map(topic => {
            const problems = groupedProblems[topic];
            const completedCount = problems.filter(p => progressTracker.isCompleted(p.url)).length;
            const totalCount = problems.length;
            const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            const problemRows = problems.map(problem => {
                const isCompleted = progressTracker.isCompleted(problem.url);
                const isRevision = progressTracker.isRevision(problem.url);

                return `
                    <div class="topic-problem-row ${isCompleted ? 'completed' : ''}" data-url="${problem.url}">
                        <div style="text-align: center;">
                            <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
                        </div>
                        <div style="text-align: center;">
                            <button class="star-btn ${isRevision ? 'active' : ''}" title="Mark as important">&#9733;</button>
                        </div>
                        <div class="problem-title">
                            <a href="${problem.url}" target="_blank">${problem.title} <span class="problem-link-icon">↗</span></a>
                        </div>
                        <div style="text-align: center;">
                            <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="topic-group">
                    <div class="topic-header">
                        <div class="topic-header-left">
                            <span class="topic-collapse-icon">▼</span>
                            <span class="topic-name">${topic}</span>
                        </div>
                        <div class="topic-progress">
                            <span class="topic-count">${completedCount} / ${totalCount}</span>
                            <div class="topic-progress-bar">
                                <div class="topic-progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="topic-problems">
                        <div class="topic-table">
                            <div class="topic-table-header">
                                <div class="topic-table-header-cell">Status</div>
                                <div class="topic-table-header-cell">Star</div>
                                <div class="topic-table-header-cell">Problem</div>
                                <div class="topic-table-header-cell">Difficulty</div>
                            </div>
                            ${problemRows}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showError(message) {
        this.elements.problemsList.innerHTML = `
            <div class="empty-state">
                <h3>Failed to load problems</h3>
                <p>${message}</p>
            </div>
        `;
    }

    updateCompanyTab(company) {
        document.querySelectorAll('.company-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.company === company);
        });
    }

    clearFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.elements.search.value = '';
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatSheetName(name) {
        // Handle special sheet names with hyphens and numbers
        return name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }
}
