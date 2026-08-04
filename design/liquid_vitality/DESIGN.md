---
name: Liquid Vitality
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#894d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac6300'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#faf9fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  display:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: -0.4px
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.4px
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.4px
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.4px
  body-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.2px
  label-caps:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.1px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 16px
  gutter: 12px
  card-padding: 16px
  stack-gap: 20px
---

## Brand & Style
The design system is centered on a **Modern iOS/Minimalist** aesthetic, prioritizing clarity, physical wellness, and effortless data entry. It mimics the functional elegance of native Apple health applications, utilizing generous whitespace and a restricted color palette to reduce cognitive load for users tracking daily habits.

The emotional response should be one of **calm authority and reliability**. By leveraging familiar system patterns, the UI recedes into the background, allowing the user's health data and progress visualizations to take center stage. The style is "Native PWA"—it should feel indistinguishable from a compiled iOS app.

## Colors
The palette is derived from the standard iOS system colors to ensure instant recognition and accessibility. 

- **Primary (Water Blue):** Reserved for water-related metrics, primary calls to action, and active navigation states.
- **Secondary (Apple Green):** Used exclusively for nutritional success, calorie surpluses/deficits, and completed health goals.
- **Tertiary (Warning/Energy):** An optional orange (#FF9500) for streaks or items requiring immediate attention.
- **Surface & Background:** A strict adherence to the iOS layered system: `#F2F2F7` for the base background and `#FFFFFF` for content cards and grouped lists.

## Typography
This design system utilizes **Inter** as a web-accessible proxy for San Francisco. The scale follows the Apple Human Interface Guidelines for "Large" Dynamic Type.

- **Display & Headlines:** Use tight letter spacing and heavy weights to create a sense of importance for daily summaries.
- **Body:** The 17px body size is the standard for high readability on mobile devices.
- **Labels:** Small, semi-bold caps are used for section headers (e.g., "DAILY ACTIVITY") to create a clear structural hierarchy without adding visual bulk.

## Layout & Spacing
The layout employs a **Fluid Grid** with fixed outer margins. 

- **Mobile (Default):** 16px side margins with a vertical rhythm based on an 8px modular scale. 
- **Card Layouts:** Content is grouped into cards that span the full width of the safe area. 
- **Grouping:** Use the "Inset Grouped" style found in iOS settings—cards should have 16px of horizontal breathing room from the screen edge on mobile. 
- **Safe Areas:** Ensure all primary interactions (buttons, navigation) respect the bottom "Home Indicator" area by adding 34px of bottom padding.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and subtle, high-diffusion shadows rather than heavy blurs.

- **Level 0 (Background):** `#F2F2F7`. Flat.
- **Level 1 (Cards):** `#FFFFFF`. High-diffusion shadow: `0px 2px 8px rgba(0, 0, 0, 0.04)`.
- **Level 2 (Modals/Overlays):** `#FFFFFF`. Drop shadow: `0px 4px 16px rgba(0, 0, 0, 0.12)`.
- **Backdrop:** Use a `backdrop-filter: blur(20px)` on navigation bars and tab bars to create a "glass" effect that suggests content is moving beneath the chrome.

## Shapes
The design system uses a **Rounded** (12px - 16px) language to evoke a friendly, approachable feel that aligns with modern hardware industrial design.

- **Cards & Primary Containers:** 16px (`rounded-xl`) to match the curvature of modern iPhone screens.
- **Buttons & Inputs:** 12px (`rounded-lg`) for a distinct, clickable appearance.
- **Progress Rings:** Stroke caps must be rounded to maintain the soft visual language.

## Components

### Buttons
- **Primary:** High-contrast background (Primary Blue), white text, 12px corner radius. Fixed height of 50px for touch targets.
- **Secondary:** Light gray background (#E9E9EB) with Primary Blue text.

### Progress Rings
- Thick strokes (10px - 14px) with rounded ends.
- Background track should be a 10% opacity version of the progress color.
- Center area should display the numeric value in `headline-lg`.

### Cards
- Use for all data metrics (Steps, Water, Calories).
- Always include a small icon in the top left corner using the relevant system color.
- White background with 16px internal padding.

### Lists
- Use "Inset Grouped" style. 
- Rows should be 44px minimum height with a 0.5px hair-line separator (`#C6C6C8`) that stops short of the icon.

### Input Fields
- Understated styling. Use a subtle gray background or simple bottom border. 
- Large numeric inputs for tracking should use `display` typography for immediate feedback.

### Tab Bar
- Persistent bottom navigation.
- 49px to 83px height (including safe area).
- SF Symbols (or similar line icons) with 10px labels.