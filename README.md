# Focus Steps

Focus Steps is an ADHD-friendly life management dashboard built with Next.js, TypeScript, and Tailwind CSS.

It is designed for people who feel overwhelmed by traditional productivity tools and need one calm home base for daily life. Instead of showing everything at once, the app helps users focus on what matters today, break larger tasks into easier starting points, and keep important life systems visible without adding clutter.

## Who It Helps

- People with ADHD who need less visual overwhelm and more gentle structure
- Parents managing home, meals, reminders, bills, animals, and appointments
- Homeschool families who want planning and attendance tools without school-software complexity
- Anyone who wants a soft, flexible dashboard instead of a rigid productivity app

## What The App Does

- Provides a customizable dashboard with optional widgets
- Includes a focused Today View that surfaces the next best action
- Supports daily habits, one-time tasks, multi-step tasks, reminders, meals, groceries, inventory, bills, appointments, and homeschool planning
- Stores data in local storage so the app works as a lightweight personal dashboard with no backend setup

## Key Features

### Today View

- Calm daily screen with greeting, date, encouragement, and a single `Focus Now` action
- Low Energy Mode to simplify the day and prioritize easier actions
- Quick add for tasks, reminders, habits, and meals
- Daily sections only appear when their widgets are enabled

### Tasks

- One-time tasks and multi-step tasks
- `Next Step Only` behavior for active multi-step tasks
- Progress tracking and gentle encouragement
- Optional scheduling for Today View

### Habits and Reminders

- Daily habits reset automatically each day
- Reminders support one-time, weekly, and monthly responsibilities
- Today View surfaces overdue and due-today items first

### Meals, Groceries, and Home Inventory

- Simple meal planning with optional ingredient entry
- Grocery syncing from meal ingredients
- Inventory widgets for pantry, cleaning supplies, household items, and animal feed

### Homeschool Planner

- Multi-child homeschool support
- Per-child curriculum planning, yearly plans, monthly plans, unit plans, projects, and attendance
- Family-wide year-at-a-glance school calendar for holidays, breaks, field trips, days off, and special events
- Today View homeschool focus pulled from current monthly planning

### Encouragement

- Standard and Christian encouragement modes
- Custom encouragement messages
- Calm, supportive tone throughout the app

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local storage persistence

## Project Structure

- `app/`
  - `layout.tsx`: app metadata and shell
  - `page.tsx`: main state coordinator, persistence, Today View and Dashboard routing
  - `globals.css`: shared Tailwind component classes and page styling
- `components/`
  - reusable dashboard widgets and shared UI shells
- `lib/`
  - dashboard state helpers, normalization, summaries, and utility functions
- `types/`
  - shared application types

## Run Locally

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Short Demo Flow

This flow is designed to show the app in under 2 minutes:

1. Start on `Today View` and show the greeting, encouragement, and `Focus Now` card.
2. Toggle `Low Energy Mode` to show how the app simplifies the day.
3. Use `Quick add` to add a task for today with a tiny first step.
4. Mark a habit or task step complete to show the gentle progress flow.
5. Switch to `Dashboard` and briefly show widget customization.
6. Open `Homeschool planner` to show multi-child support and the year-at-a-glance calendar.
7. End by pointing out that everything stays calm, modular, and locally persisted.

## Submission Summary

Focus Steps is a calm, ADHD-friendly life dashboard that combines daily focus, task breakdown, reminders, meals, home organization, and homeschool planning in one modular app. It is built to reduce overwhelm, support real family life, and help users keep moving with one small next step at a time.
