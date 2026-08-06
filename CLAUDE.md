# Claude Code Configuration

## Project Overview
Chinese Language Learning App - A Clean Architecture web application for learning Chinese at HSK levels.

## Architecture
- **Pattern**: Clean Architecture (4 layers)
- **UI Framework**: Vanilla JavaScript (no frameworks)
- **Storage**: Browser LocalStorage for user progress
- **Data Source**: Mock data (can be replaced with real API)

## Technology Stack
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (with CSS variables for theming)
- No external dependencies for frontend

## Directory Structure
```
src/
├── presentation/    # UI Components & Pages
├── domain/         # Business Logic & Entities
├── data/           # Repositories & Data Sources
├── utils/          # Helper Functions
└── config/         # Configuration Constants
```

## How to Run
1. Open `src/presentation/pages/index.html` in a browser
2. Or run `npm start` to use a local server

## Key Files to Edit

### Add New Lessons/Words
- File: `src/data/datasources/MockDataSource.js`
- The `mockWords` and `mockLessons` objects contain data

### Modify UI
- Components: `src/presentation/components/`
- Styles: `src/presentation/styles/index.css`

### Update Business Logic
- Use Cases: `src/domain/usecases/`
- Entities: `src/domain/entities/`

### Connect Real API
- File: `src/presentation/app.js` (line: `initializeDependencies`)
- Change: `new MockDataSource()` to `new ApiDataSource('your-api-url')`

## Common Tasks

### Task: Add a new HSK level
1. Update `HSK_LEVELS` in `src/config/constants.js`
2. Add data to `MockDataSource.js`

### Task: Add new quiz types
1. Extend `QuizView.js` to support new question formats
2. Update `QUIZ_TYPES` in `src/config/constants.js`

### Task: Modify styling
1. Edit `src/presentation/styles/index.css`
2. CSS variables are in `:root` selector (line ~7-18)

### Task: Add user authentication
1. Create new use case: `src/domain/usecases/AuthenticateUser.js`
2. Add auth data source: `src/data/datasources/AuthDataSource.js`
3. Update `app.js` initialization

## Important Notes
- No build step needed - files load directly in browser
- All module imports use ES6 syntax with `.js` extensions
- User progress is saved automatically to LocalStorage
- Mock data is used for development - replace with real API when ready

## Next Steps for Full Implementation
- [ ] Connect to real Chinese learning API
- [ ] Add user authentication
- [ ] Implement listening exercises with audio
- [ ] Add writing/stroke practice
- [ ] Create progress analytics dashboard
- [ ] Add social features (leaderboard, sharing)
- [ ] Multi-language support

## Testing Approach
- Each layer can be tested independently
- Mock `DataSource` can be used for testing without real API
- Use cases are pure functions (easily testable)

## Performance Considerations
- Data is cached in repositories to avoid repeated API calls
- Quiz questions are shuffled on-demand
- Progress is persisted to LocalStorage
