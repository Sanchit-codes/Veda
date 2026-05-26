# Product Requirements Document

## Product Name
AI Assessment Creator

## Overview
AI Assessment Creator is a web application that helps teachers generate structured assessments from curriculum documents and existing question banks. Teachers upload source material, define exam sections, and generate each section with AI in a controlled and editable workflow. The product also provides a separate answer key and exportable exam output.

## Objective
Deliver a polished full-stack assessment creation experience that demonstrates:
- strong frontend execution from Figma
- structured AI integration
- real-time backend processing
- thoughtful educational workflow design

## Problem Statement
Teachers spend significant time creating question papers that align with curriculum, difficulty balance, and exam structure. Generic LLM chat outputs are often unstructured, difficult to edit, and unsuitable for direct classroom use. Teachers need a system that uses existing material, produces exam-ready sections, and preserves editorial control.

## Users
### Primary user
- Teacher or educator preparing assignments/exams

### Secondary user
- Internal evaluator/reviewer assessing engineering quality of the solution

## Goals
### Primary goals
- Let teachers create an assignment using a structured form.
- Let teachers upload source PDFs such as curriculum and question banks.
- Generate question paper content section-by-section.
- Stream generation progress in real time.
- Present generated sections in a structured exam-paper layout.
- Allow full hand editing of the generated output.
- Generate and show a separate answer key.

### Secondary goals
- Allow regeneration of a single question.
- Export printable output as PDF.
- Preserve assignments and generated results in the database.

## Non-Goals
- Student test-taking interface
- Automatic grading system
- Multi-user collaboration
- Long-term analytics dashboard
- LMS integrations

## Success Criteria
A successful implementation should allow a reviewer to:
1. Upload source material.
2. Configure a paper with multiple sections.
3. Trigger section-wise AI generation.
4. Observe live generation updates.
5. Edit the resulting questions manually.
6. Regenerate one question independently.
7. View a separate answer key.
8. Export a presentable paper.

## User Stories
### Assignment creation
- As a teacher, I want to create an assignment with due date and instructions so that I can define the exam context.
- As a teacher, I want to upload curriculum/question bank PDFs so that AI can use real source material.
- As a teacher, I want to configure each section independently so that the final paper matches my intended structure.

### Generation
- As a teacher, I want AI to generate one section at a time so that I retain control over the paper.
- As a teacher, I want to see generation progress live so that the system feels transparent and responsive.

### Editing
- As a teacher, I want to manually edit any question so that I can refine wording and correctness.
- As a teacher, I want to regenerate a single weak question so that I do not lose the rest of the section.

### Output
- As a teacher, I want a separate answer-key page so that student and teacher versions remain clean.
- As a teacher, I want a properly formatted downloadable PDF so that I can directly use it.

## Functional Requirements

### 1. Assignment Creation
The system must provide a form with:
- title/subject
- due date
- optional additional instructions
- source material upload (PDF/text)
- section configuration inputs

Each section configuration must support:
- section title or label
- question type
- number of questions
- marks per question or section marks
- optional instructions
- optional difficulty distribution

Validation requirements:
- no empty required fields
- no negative values
- no zero-question sections
- supported file type validation

### 2. Source Material Parsing
The system must:
- accept PDF uploads
- extract text from curriculum/question bank files
- store metadata about uploaded files
- make extracted text available for prompt construction

### 3. AI Question Generation
The system must:
- transform assignment config + source text into a structured prompt
- generate one section at a time
- return structured questions, not free-form text
- associate each question with difficulty and Bloom's taxonomy
- produce answer and explanation data for answer-key generation

### 4. Structured Rendering
The system must not directly render raw LLM text.
Instead it must:
- parse response into a typed schema
- validate the parsed response
- render sections/questions through UI components

### 5. Real-Time Updates
The system must:
- use WebSocket for live job status
- support streaming/progressive UI during generation
- notify the frontend on queue, progress, completion, and failure states

### 6. Output Page
The output page must include:
- student info area with name, roll number, section lines/fields
- grouped sections such as Section A, Section B
- instruction text per section
- question list
- difficulty tags
- marks per question

### 7. Editing
The generated output must support:
- full manual editing of all question text
- editing of marks and possibly metadata
- single-question regeneration
- persistence of edits

### 8. Answer Key
The system must generate a separate answer-key view/page that contains:
- section mapping
- question answers
- optional explanations/rationales
- manual edit support

### 9. Export
The system should support export to PDF with:
- proper formatting
- readable spacing
- separate question paper and answer key sections/pages

## Experience Requirements
- Clean, premium UI aligned with Figma.
- Mobile-responsive layouts.
- Exam-paper readability over flashy dashboards.
- Low-friction editing interactions.
- Clear visual hierarchy for sections and question metadata.

## Technical Requirements
### Frontend
- Next.js
- TypeScript
- Zustand or Redux (Zustand preferred)
- WebSocket client support

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- BullMQ
- WebSocket server

### AI
- Any suitable LLM provider
- structured prompt + parsing required
- provider abstraction preferred

### Deployment
- Dockerized deployment on Oracle server
- environment-based configuration

## Suggested Core Entities
- Assignment
- AssignmentSectionConfig
- SourceDocument
- GeneratedSection
- Question
- AnswerKeyEntry
- JobState

## Constraints
- Timeline is approximately 24 hours.
- Reliability is more important than over-engineering.
- The implementation should remain demo-friendly and evaluator-friendly.

## Risks
- PDF extraction quality may vary by source file.
- LLM response consistency may break schema parsing.
- Streaming UX can become noisy if not buffered properly.
- Single-question regeneration must preserve section state correctly.

## Mitigations
- Validate and normalize extracted source text.
- Enforce schema validation after generation.
- Stream meaningful chunks/events, not every character if unstable.
- Keep question identity stable through IDs.

## MVP Scope
The MVP should include:
- assignment creation
- PDF upload and parsing
- section-wise generation
- live progress updates
- structured output page
- editable questions
- answer key page

## High-Value Stretch Scope
- single-question regeneration
- PDF export
- saved assignment history
- finer-grained prompt controls
