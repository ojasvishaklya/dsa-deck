import { DataLoader } from './services/DataLoader.js';
import { ProgressTracker } from './services/ProgressTracker.js';
import { ProblemFilter } from './services/ProblemFilter.js';
import { UIRenderer } from './views/UIRenderer.js';

export class App {
    constructor(config) {
        this.config = config;
        this.dataLoader = new DataLoader(config.sheetsDir, config.availableCompanies);
        this.progressTracker = new ProgressTracker(config.storageKey);
        this.filter = new ProblemFilter();
        this.renderer = new UIRenderer();

        this.allProblems = {};
        this.combinedProblems = [];
        this.currentCompany = 'all';
    }

    async init() {
        try {
            console.log('Loading company data...');
            this.allProblems = await this.dataLoader.loadAll();

            console.log('Building combined list...');
            this.combinedProblems = this.dataLoader.buildCombinedList(this.allProblems);

            console.log('Rendering company tabs...');
            this.renderer.renderCompanyTabs(this.config.availableCompanies, this.allProblems, this.combinedProblems.length);

            console.log('Setting up event listeners...');
            this.setupEventListeners();

            console.log('Switching to default company...');
            this.switchCompany('all');

            console.log('App initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.renderer.showError(error.message);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.company-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCompany(e.target.dataset.company);
            });
        });

        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.difficulty;
                if (this.filter.difficulty.has(difficulty)) {
                    this.filter.difficulty.delete(difficulty);
                    e.target.classList.remove('active');
                } else {
                    this.filter.difficulty.add(difficulty);
                    e.target.classList.add('active');
                }
                this.render();
            });
        });

        document.getElementById('show-completed').addEventListener('click', (e) => {
            const btn = e.target;
            if (this.filter.completed === true) {
                this.filter.completed = null;
                btn.classList.remove('active');
            } else {
                this.filter.completed = true;
                btn.classList.add('active');
                document.getElementById('show-incomplete').classList.remove('active');
            }
            this.render();
        });

        document.getElementById('show-incomplete').addEventListener('click', (e) => {
            const btn = e.target;
            if (this.filter.completed === false) {
                this.filter.completed = null;
                btn.classList.remove('active');
            } else {
                this.filter.completed = false;
                btn.classList.add('active');
                document.getElementById('show-completed').classList.remove('active');
            }
            this.render();
        });

        document.getElementById('show-revision').addEventListener('click', (e) => {
            const btn = e.target;
            this.filter.revision = !this.filter.revision;
            btn.classList.toggle('active', this.filter.revision);
            this.render();
        });

        document.getElementById('search').addEventListener('input', (e) => {
            this.filter.search = e.target.value.toLowerCase();
            this.render();
        });
    }

    switchCompany(company) {
        this.currentCompany = company;
        this.renderer.updateCompanyTab(company);
        this.filter.reset();
        this.renderer.clearFilters();
        this.render();
    }

    render() {
        const problems = this.currentCompany === 'all'
            ? this.combinedProblems
            : (this.allProblems[this.currentCompany] || []);

        const filteredProblems = this.filter.apply(problems, this.progressTracker);
        const completedCount = this.progressTracker.getCompletedCount(problems);
        const revisionCount = this.progressTracker.getRevisionCount(problems);

        this.renderer.renderStats(problems.length, completedCount, revisionCount);
        this.renderer.renderProblems(filteredProblems, this.currentCompany, this.progressTracker);
        this.attachProblemListeners();
    }

    attachProblemListeners() {
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const item = e.target.closest('.problem-item');
                const url = item.dataset.url;

                this.progressTracker.toggleCompletion(url, e.target.checked);
                this.render();
            });
        });

        document.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.problem-item');
                const url = item.dataset.url;

                this.progressTracker.toggleRevision(url);
                this.render();
            });
        });
    }
}
