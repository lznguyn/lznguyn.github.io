# Chinese Learning API (.NET 8)

Clean Architecture backend for the HSK learning app. The JS frontend in `../src` calls it through `ApiDataSource`.

```
src/
  ChineseLearning.Domain          entities, HskLevel value object (no dependencies)
  ChineseLearning.Application     use cases, DTOs, repository interfaces
  ChineseLearning.Infrastructure  EF Core + SQLite, repositories, seed data
  ChineseLearning.Api             Minimal API, DI composition root, error handling, CORS
tests/
  ChineseLearning.Application.Tests   xUnit tests for use cases
```

## Run

```
dotnet run --project backend/src/ChineseLearning.Api --launch-profile http   # http://localhost:5000, Swagger at /swagger
npm start                                                                    # frontend on http://localhost:8080
dotnet test backend
```

The SQLite database (`chinese-learning.db`) is created and seeded on first start.

## Endpoints (`/api`)

| Method | Route | Use case |
|---|---|---|
| GET | `/words?level=` | GetWordsByLevel |
| GET | `/words/{id}` | GetWordById |
| GET | `/words/search?q=&level=` | SearchWords |
| GET | `/words/quiz?level=&count=` | GetRandomWordsForQuiz |
| GET | `/lessons?level=` | GetLessonsByLevel (`words` = ids) |
| GET | `/lessons/{id}` | GetLessonById |
| GET | `/lessons/{id}/words` | GetLessonWithWords (`words` = full words) |
| GET | `/users/{userId}/progress` | GetUserProgress |
| POST | `/users/{userId}/progress/learned-words` | `{ "wordId" }` |
| POST | `/users/{userId}/progress/completed-lessons` | `{ "lessonId", "score" }` |
| PUT | `/users/{userId}/progress/current-lesson` | `{ "lessonId" }` |

Validation errors return 400 and missing resources 404, both as `{ "error": "..." }`.
