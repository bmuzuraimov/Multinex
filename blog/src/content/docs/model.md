---
title: Data Model
description: Comprehensive documentation of the Multinex database schema
---

# Multinex Data Model

This document provides a detailed overview of the Multinex database schema, explaining each model, its purpose, and relationships.

## Overview

Multinex uses PostgreSQL as its database with Prisma as the ORM. The data model is designed to support:

- User management and authentication
- Course and topic organization
- Exercise creation and tracking
- Quiz functionality
- Feedback collection
- Organization management
- Subscription handling

## Core Models

### User

The central entity representing application users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `created_at` | DateTime | When the user was created |
| `email` | String | User's email address (unique) |
| `username` | String | User's username (unique) |
| `last_active` | DateTime | When the user was last active |
| `stripe_id` | String | Stripe customer ID for payments |
| `checkout_session_id` | String | Stripe checkout session ID |
| `send_email` | Boolean | Whether user accepts emails |
| `onboarding_complete` | Boolean | Whether user completed onboarding |
| `tour_complete` | Boolean | Whether user completed app tour |
| `date_paid` | DateTime | When user last paid |
| `language` | String | User's preferred language |
| `credits` | Int | Available exercise credits (starts with 10) |
| `deleted_at` | DateTime | Soft deletion timestamp |

**Relationships:**
- Has many `Course`s
- Has many `Topic`s
- Has many `Exercise`s
- Has many `Feedback` entries
- Belongs to one `Organization` (optional)
- Has one `Onboarding` profile

### Onboarding

Stores user preferences and information collected during onboarding.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `user_type` | String | Type of user (Student, Teacher, etc.) |
| `user_type_other` | String | Custom user type if "Other" |
| `learning_style` | String | Preferred learning style |

**Subject Interests:**
- `science_medicine` | Boolean
- `technology_engineering` | Boolean
- `business_economics` | Boolean
- `humanities_arts` | Boolean
- `language_learning` | Boolean
- `test_prep` | Boolean
- `subject_other` | String

**Motivation Factors:**
- `motivation_progress` | Boolean
- `motivation_gamification` | Boolean
- `motivation_reminders` | Boolean
- `motivation_community` | Boolean
- `motivation_tool_only` | Boolean

**Marketing Sources:**
- `source_twitter` | Boolean
- `source_instagram` | Boolean
- `source_tiktok` | Boolean
- `source_facebook` | Boolean
- `source_youtube` | Boolean
- `source_google` | Boolean
- `source_word_of_mouth` | Boolean
- `source_other` | String

**Relationships:**
- Belongs to one `User`

### Organization

Represents educational institutions or companies with multiple users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `created_at` | DateTime | When the organization was created |
| `name` | String | Organization name |
| `email_domain` | String | Email domain for auto-enrollment |
| `stripe_customer_id` | String | Stripe customer ID |
| `subscription_status` | String | Current subscription status |
| `subscription_plan` | String | Current subscription plan |
| `seats` | Int | Number of licensed seats |

**Relationships:**
- Has many `User`s

## Learning Content Models

### Course

A collection of related learning topics.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `duplicate_id` | String | ID of original course if duplicated |
| `name` | String | Course name |
| `image` | String | Course image URL |
| `description` | String | Course description |
| `is_public` | Boolean | Whether course is publicly accessible |
| `user_id` | String | ID of course creator |
| `created_at` | DateTime | When the course was created |

**Relationships:**
- Belongs to one `User`
- Has many `Topic`s

### Topic

A section within a course containing related exercises.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `name` | String | Topic name |
| `course_id` | String | ID of parent course |
| `user_id` | String | ID of topic creator |
| `length` | Int | Target length of exercises (default: 500) |
| `level` | String | Difficulty level |
| `created_at` | DateTime | When the topic was created |

**Relationships:**
- Belongs to one `Course`
- Belongs to one `User`
- Has many `Exercise`s

### Exercise

The core learning unit containing text for typing practice.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `status` | ExerciseStatus | Current processing status |
| `name` | String | Exercise name |
| `raw_text` | String | Original unprocessed text |
| `lesson_text` | String | Processed text for typing |
| `audio_timestamps` | String[] | Timestamps for audio playback |
| `paragraph_summary` | String | Summary of exercise content |
| `level` | String | Difficulty level |
| `cursor` | Int | Current cursor position |
| `word_count` | Int | Number of words in exercise |
| `completed` | Boolean | Whether exercise is completed |
| `completed_at` | DateTime | When exercise was completed |
| `truncated` | Boolean | Whether text was truncated |
| `score` | Int | User's score on exercise |
| `tokens` | Int | Number of tokens used |
| `model` | String | AI model used for generation |
| `pre_prompt` | String | Prompt prefix for generation |
| `post_prompt` | String | Prompt suffix for generation |
| `user_evaluation` | Int | User rating of exercise |
| `user_id` | String | ID of exercise creator |
| `topic_id` | String | ID of parent topic |
| `created_at` | DateTime | When exercise was created |

**Relationships:**
- Belongs to one `User` (optional)
- Belongs to one `Topic` (optional)
- Has many `Question`s
- Has one `DemoExercise` (optional)

### Question

Multiple-choice questions for quizzing on exercise content.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `text` | String | Question text |
| `exercise_id` | String | ID of parent exercise |
| `created_at` | DateTime | When question was created |

**Relationships:**
- Belongs to one `Exercise`
- Has many `Option`s

### Option

Answer options for quiz questions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `text` | String | Option text |
| `is_correct` | Boolean | Whether option is correct |
| `question_id` | String | ID of parent question |
| `created_at` | DateTime | When option was created |

**Relationships:**
- Belongs to one `Question`

## Supporting Models

### DemoExercise

Tracks demo exercises shown to visitors.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `created_at` | DateTime | When record was created |
| `user_agent` | String | Browser and OS info |
| `browser_language` | String | Visitor's browser language |
| `screen_resolution` | String | Visitor's screen resolution |
| `timezone` | String | Visitor's timezone |
| `exercise_id` | String | ID of exercise shown |

**Relationships:**
- Belongs to one `Exercise`

### Feedback

Stores user feedback about the application.

| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary identifier |
| `created_at` | DateTime | When feedback was submitted |
| `message` | String | Feedback message |
| `email` | String | User's email |
| `user_id` | String | ID of user submitting feedback |
| `rating` | Int | Overall rating (0-5) |
| `usability` | String | Feedback about app usability |
| `features` | String | Feedback about specific features |
| `improvements` | String | Suggestions for improvements |
| `would_recommend` | Boolean | Whether user would recommend app |
| `experience_level` | String | User's typing/learning experience |
| `browser_info` | String | Technical context |
| `category` | String | Category of feedback |

**Relationships:**
- Belongs to one `User`

### Newsletter

Manages newsletter subscriptions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary identifier |
| `created_at` | DateTime | When subscription was created |
| `updated_at` | DateTime | When subscription was updated |
| `email` | String | Subscriber's email |
| `subscribed` | Boolean | Whether currently subscribed |
| `source` | String | Where subscription came from |
| `ip_address` | String | IP address at subscription time |
| `user_agent` | String | Browser/device info |
| `last_sent_at` | DateTime | When last email was sent |
| `last_opened_at` | DateTime | When last email was opened |
| `open_count` | Int | Number of emails opened |
| `bounce_count` | Int | Number of bounced emails |

### Logs

System logs for application monitoring.

| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary identifier |
| `created_at` | DateTime | When log was created |
| `message` | String | Log message |
| `level` | String | Log level (INFO, ERROR, etc.) |

### ExerciseGeneratePrompt

Stores prompts used for exercise generation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary identifier |
| `user_id` | String | ID of user who created prompt |
| `pre_prompt` | String | Prompt prefix |
| `post_prompt` | String | Prompt suffix |
| `created_at` | DateTime | When prompt was created |
| `updated_at` | DateTime | When prompt was updated |

## Enums

### ExerciseStatus

Tracks the processing status of exercises:

- `CREATED` - Initial state
- `FILE_UPLOADED` - Document file has been uploaded
- `DOCUMENT_SCANNED` - Document has been scanned/processed
- `EXERCISE_GENERATED` - Exercise text has been generated
- `EXERCISE_TAGGED` - Exercise has been tagged with metadata
- `SUMMARY_GENERATED` - Summary has been generated
- `QUESTIONS_GENERATED` - Quiz questions have been generated
- `FINISHED` - Exercise is ready for use

## Database Indexes

Indexes are defined on frequently queried fields to improve performance:

- User: `email`, `username`, `organization_id`, `last_active`
- Onboarding: `user_id`
- Organization: `email_domain`, `subscription_status`
- Course: `user_id`, `is_public`
- Topic: `course_id`, `user_id`
- Exercise: `user_id`, `topic_id`, `status`, `completed`
- Question: `exercise_id`
- Option: `question_id`, `is_correct`
- DemoExercise: `user_agent`, `browser_language`, `screen_resolution`, `timezone`, `exercise_id`
- Newsletter: `email`, `subscribed`, `last_sent_at`

## Relationships Diagram
