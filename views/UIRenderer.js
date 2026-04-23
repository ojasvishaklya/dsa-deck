export class UIRenderer {
    constructor() {
        this.elements = {
            companyTabs: document.getElementById('company-tabs'),
            problemsList: document.getElementById('problems-list'),
            totalProblems: document.getElementById('total-problems'),
            completedProblems: document.getElementById('completed-problems'),
            revisionCount: document.getElementById('revision-count'),
            progressPercentage: document.getElementById('progress-percentage'),
            search: document.getElementById('search')
        };
    }

    renderCompanyTabs(availableCompanies) {
        this.elements.companyTabs.innerHTML = `
            <button class="company-tab" data-company="all">All Companies</button>
            ${availableCompanies.map(company =>
                `<button class="company-tab" data-company="${company}">${this.capitalize(company)}</button>`
            ).join('')}
        `;
    }

    renderStats(totalCount, completedCount, revisionCount) {
        this.elements.totalProblems.textContent = `Total: ${totalCount}`;
        this.elements.completedProblems.textContent = `Completed: ${completedCount}`;
        this.elements.revisionCount.textContent = `Revision: ${revisionCount}`;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        this.elements.progressPercentage.textContent = `Progress: ${percentage}%`;
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
                    `<span class="company-badge ${c}">${c.substring(0, 3)}</span>`
                  ).join('')}</div>`
                : '';

            return `
                <div class="problem-item ${isCompleted ? 'completed' : ''}" data-url="${problem.url}">
                    <button class="star-btn ${isRevision ? 'active' : ''}" title="Mark as important">&#9733;</button>
                    <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
                    <span class="problem-number">#${index + 1}</span>
                    <div class="problem-title">
                        <a href="${problem.url}" target="_blank">${problem.title}</a>
                        ${companyBadges}
                    </div>
                    <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
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
}
