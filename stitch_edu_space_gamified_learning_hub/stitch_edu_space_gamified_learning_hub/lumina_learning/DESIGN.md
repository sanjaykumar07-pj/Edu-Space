---
name: Lumina Learning
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 240px
  topbar_height: 64px
  gutter: 24px
  margin_desktop: 40px
  margin_mobile: 16px
  container_max_width: 1200px
---

## Brand & Style

The design system is built on a "Functional Play" philosophy, merging the rigorous efficiency of a productivity tool with the dopamine-driven engagement of a gamified experience. It targets a modern learner who values both clarity and motivation. 

The visual style is **Corporate Modern with a Playful Edge**. It utilizes generous whitespace and a structured grid to maintain focus, while injecting energy through vibrant accent colors and tactile, rounded components. The interface should feel organized and "calm" like a high-end workspace, but punctuated with celebratory animations and bold "achievement" moments that reward progress.

## Colors

This design system uses a high-energy palette grounded by a soft neutral environment.

- **Primary (Indigo):** Used for core navigation, primary actions, and branding. It represents focus and professionalism.
- **XP/Rewards (Amber):** Reserved strictly for gamification elements like streaks, coin counts, and level-ups to ensure high visual salience.
- **Success (Green):** Used for "Correct" states in quizzes and completion milestones.
- **Error (Red):** Used for "Incorrect" states and destructive actions.
- **Background & Surface:** The base uses a soft gray to reduce eye strain, while white cards create a clear "layer" for content.

## Typography

The typography system relies exclusively on **Inter** to maintain a clean, technical, and highly legible appearance. 

- **Weight Strategy:** Headlines use Extra Bold (800) or Bold (700) weights to create a strong hierarchy and a "notion-like" clarity. 
- **Body Text:** Standardized on a 16px base for optimal readability in learning modules.
- **Labels:** Small labels use a semi-bold weight and increased letter spacing for categorization and status indicators.
- **Responsive:** Headlines scale down significantly on mobile to ensure titles don't wrap excessively, preserving the clean grid look.

## Layout & Spacing

The layout uses a **Structured Card-Based Grid** within a fixed navigation framework.

- **Sidebar:** A permanent 240px sidebar on the left provides the primary navigational anchor. It uses a slightly darker tint of the background or a subtle Indigo accent to differentiate from the content area.
- **Top Bar:** A 64px fixed header houses global search, notifications, and the user's XP/Streak profile.
- **Main Content:** Content is centered in a container with a max-width of 1200px to prevent lines of text from becoming too long.
- **Grid:** Elements should follow an 8px spacing scale (8, 16, 24, 32, 48, 64) to maintain mathematical rhythm across all views.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** Soft Gray (#F8F9FB).
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)). This makes content look like it's resting gently on the background.
- **Level 2 (Interaction/Popovers):** Used for tooltips and dropdowns. These feature a slightly more pronounced shadow (0px 10px 30px rgba(0, 0, 0, 0.1)) to indicate they are floating above the surface.
- **Focus States:** High-contrast Indigo rings (2px offset) are used to indicate keyboard focus, maintaining accessibility without cluttering the UI.

## Shapes

The shape language is consistently **Rounded**, reinforcing the friendly and approachable personality of the platform.

- **Standard Components:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Content cards and modals use a 1rem (16px) radius to feel more like distinct, tactile objects.
- **Gamification Elements:** Badges, XP pills, and streak counters use **Full Rounding (Pill-shaped)** to differentiate them from standard UI controls and make them feel more like collectible "items."

## Components

- **Buttons:**
  - **Primary:** Solid Indigo with white text. On hover, darken the indigo slightly. Use for "Continue," "Start Lesson," or "Submit."
  - **Success:** Solid Green. Reserved for correct answers or completed modules.
  - **Ghost:** Transparent background with Indigo border and text. Used for secondary actions like "View Leaderboard" or "Save for Later."
- **Inputs:** White background, 1px border (#E5E7EB), and 12px vertical / 16px horizontal padding. On focus, the border turns Indigo with a soft glow.
- **Cards:** White surfaces with 16px corner radius. Used for course modules, lesson previews, and user stats.
- **Badges/Pills:** Small, pill-shaped containers.
  - *XP:* Amber background with Dark Amber text.
  - *Status:* Light Gray background with Dark Gray text.
- **Sidebar Items:** Clear, legible icons (Lucide-style) with a vertical 4px "active" indicator on the left side and a subtle Indigo background tint for the selected state.
- **Progress Bars:** Thick (8-12px), rounded tracks with vibrant fills (Indigo for course progress, Amber for XP progress).