# DSA Deck

Lightweight LeetCode problem tracker for company-specific interview prep.

## Features

- Track problems across companies (Amazon, Google, Microsoft, Salesforce)
- Filter by difficulty, completion status, or search
- Progress saved in browser (localStorage)
- Shows which companies ask each problem
- Fully client-side, no backend

## Usage

Open `index.html` in any browser. For GitHub Pages: push to GitHub and enable Pages in Settings.

## Adding Companies

1. Add `company-name-leetcode.json` to `/sheets/`
2. Update `availableCompanies` in `config.js`

## Structure

```
├── index.html, styles.css, main.js
├── App.js, config.js
├── models/Problem.js
├── services/DataLoader.js, ProgressTracker.js, ProblemFilter.js
├── views/UIRenderer.js
└── sheets/*.json
```
