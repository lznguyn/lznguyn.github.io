# Chinese Language Learning App

A modern, interactive web application for learning Chinese at your own pace. Built with Clean Architecture principles, featuring HSK levels, interactive lessons, and interactive quizzes.

## 📋 Project Structure

```
src/
├── presentation/              # UI Layer (Components & Pages)
│   ├── components/           # Reusable UI components
│   │   ├── LevelSelector.js       # HSK level selection
│   │   ├── LessonView.js          # Lesson learning interface
│   │   ├── QuizView.js            # Quiz interface
│   │   └── ProgressTracker.js     # Progress display
│   ├── pages/
│   │   └── index.html             # Main HTML file
│   ├── styles/
│   │   └── index.css              # Global styles
│   └── app.js                     # Main application entry point
│
├── domain/                    # Business Logic Layer
│   ├── entities/             # Core domain objects
│   │   ├── Word.js               # Word entity
│   │   ├── Lesson.js             # Lesson entity
│   │   └── UserProgress.js       # User progress tracking
│   └── usecases/             # Business logic workflows
│       ├── GetLessonsByLevel.js
│       ├── GetLessonWithWords.js
│       ├── GetRandomWordsForQuiz.js
│       └── UpdateUserProgress.js
│
├── data/                      # Data Access Layer
│   ├── repositories/         # Repository pattern implementations
│   │   ├── WordRepository.js
│   │   ├── LessonRepository.js
│   │   └── UserProgressRepository.js
│   ├── datasources/          # External API & local storage access
│   │   ├── MockDataSource.js     # Mock data for development
│   │   └── ApiDataSource.js      # Real API integration
│   └── models/               # Data models/DTOs
│
├── utils/                     # Helper Functions
│   ├── formatters.js         # Formatting utilities
│   └── validators.js         # Validation utilities
│
└── config/                    # Configuration
    └── constants.js          # App constants & config
```

## 🏗️ Architecture Pattern: Clean Architecture

### Layers:

1. **Presentation Layer** (`src/presentation/`)
   - Handles UI rendering and user interactions
   - Components for different views (levels, lessons, quizzes)
   - No business logic here

2. **Domain Layer** (`src/domain/`)
   - Contains business logic and entities
   - Independent of UI and external services
   - Use cases define how the app works

3. **Data Layer** (`src/data/`)
   - Manages data access and external services
   - Repository pattern for abstraction
   - Data sources handle API calls and storage

### Benefits:
- ✅ **Testability**: Each layer can be tested independently
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Scalability**: Easy to add new features
- ✅ **Reusability**: Business logic is independent of UI

## 🎯 Key Features

### Levels (HSK 1-6)
- HSK 1: 150 words (Beginner)
- HSK 2: 300 words (Elementary)
- HSK 3: 600 words (Pre-intermediate)
- HSK 4: 1200 words (Intermediate)
- HSK 5: 2500 words (Advanced)
- HSK 6: 5000 words (Mastery)

### Learning Modes
- 📚 **Vocabulary Learning**: Learn words with pinyin and examples
- 📝 **Quiz Mode**: Test your knowledge with multiple-choice questions
- 📊 **Progress Tracking**: Monitor your learning progress

### User Features
- 📱 Responsive design (works on desktop, tablet, mobile)
- 💾 Local progress tracking using browser storage
- 🎯 Customizable learning pace

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lznguyn.github.io
```

2. Install dependencies:
```bash
npm install
```

### Running the App

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Then open `src/presentation/pages/index.html` in your browser.

## 📚 How to Use

1. **Select a Level**: Choose your HSK level (1-6)
2. **Pick a Lesson**: Select from available lessons
3. **Learn Words**: Study words with pinyin, English translation, and examples
4. **Take Quiz**: Test your knowledge after each lesson
5. **Track Progress**: Monitor your learning statistics

## 🔧 Configuration

### Edit API Endpoint
In `src/data/datasources/ApiDataSource.js`:
```javascript
const dataSource = new ApiDataSource('https://your-api.com');
```

### Add More Lessons
Edit `src/data/datasources/MockDataSource.js` to add:
- New lessons
- New words
- New quiz questions

## 🧪 Testing

Each use case and entity can be tested independently:

```javascript
// Example: Testing GetLessonsByLevel
const usecase = new GetLessonsByLevel(lessonRepository);
const lessons = await usecase.execute(1);
```

## 📝 Example Entities

### Word Entity
```javascript
{
  id: '1',
  chinese: '你好',
  pinyin: 'nǐ hǎo',
  english: 'Hello',
  hskLevel: 1,
  partOfSpeech: 'greeting',
  example: '你好，我是小王。'
}
```

### Lesson Entity
```javascript
{
  id: 'L1',
  title: 'Basic Greetings',
  hskLevel: 1,
  words: ['1', '2', '3'],
  description: 'Learn basic greetings',
  order: 1
}
```

## 🔌 API Integration

To connect to a real API:

1. Update `ApiDataSource` with your API endpoints
2. Modify the app initialization in `src/presentation/app.js`:

```javascript
const dataSource = new ApiDataSource('https://your-api.com');
this.wordRepository = new WordRepository(dataSource);
```

## 📊 Progress Tracking

User progress is automatically saved to browser local storage:
- Completed lessons
- Learned words
- Quiz scores
- Learning streak

## 🎨 Customization

### Colors
Edit CSS variables in `src/presentation/styles/index.css`:
```css
:root {
  --primary: #e74c3c;
  --secondary: #3498db;
  /* ... more colors */
}
```

### Add New Quiz Types
Extend `QuizView.js` with new question formats:
- Fill in the blank
- Listening comprehension
- Writing practice

## 📄 License

MIT License - feel free to use this project for learning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please open an issue on the repository.

---

**Happy Learning! 🎉**
