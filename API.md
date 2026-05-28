# VedaAI API Documentation

## Assignments

### POST /api/assignments
Create a new assignment.

**Request:**
```json
{
  "title": "Chapter 5 Exam",
  "subject": "Science",
  "className": "8A",
  "schoolName": "DPS",
  "sectionConfigs": [
    {
      "type": "mcq",
      "questionCount": 5,
      "marksPerQuestion": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "draft"
  }
}
```

### POST /api/assignments/:id/generate
Trigger generation for an assignment.

### GET /api/assignments/:id
Fetch assignment with generated sections.

## WebSocket Events

### job:queued
Emitted when generation job is queued.

### section:stream
Emitted for each token in section generation.

### section:completed
Emitted when a section is fully generated.

### job:completed
Emitted when all sections are generated.
