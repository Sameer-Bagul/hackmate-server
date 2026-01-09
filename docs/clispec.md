This is where HackMate becomes **legendary**, not just functional.

I’ll give you:

1. **Full CLI Specification (formal)**
2. **UI/TUI design system**
3. **Color + theming system**
4. **Layout patterns**
5. **Interaction patterns**
6. **Inspiration sources**
7. **Accessibility & UX rules**
8. **Animation & effects guidelines**

This will let your team build a **beautiful multi-color hacker-grade UI inside the terminal**.

---

# 1️⃣ HackMate CLI SPEC (Formal)

This is the **contract** between:

* CLI
* Backend
* Users
* Automation scripts

---

## 1.1 Command Grammar

```
hackmate <namespace> <command> [args] [flags]
```

Examples:

```
hackmate profile view @neo
hackmate discover --stack rust --intent startup
hackmate chat @neo --live
```

---

## 1.2 Global Flags

These work on *every* command:

| Flag              | Purpose                 |
| ----------------- | ----------------------- |
| `--help`          | Show help               |
| `--version`       | CLI version             |
| `--json`          | Machine-readable output |
| `--debug`         | Verbose logs            |
| `--no-color`      | Disable colors          |
| `--config <path>` | Custom config           |
| `--quiet`         | Minimal output          |
| `--raw`           | No formatting           |

---

## 1.3 Output Modes

HackMate supports:

### 1. Human Mode (default)

Pretty, colorful, TUI.

### 2. JSON Mode

For scripting:

```
hackmate discover --json
```

### 3. Raw Mode

Plain text, no decorations.

---

## 1.4 Exit Codes

| Code | Meaning           |
| ---- | ----------------- |
| 0    | Success           |
| 1    | General error     |
| 2    | Invalid args      |
| 3    | Auth error        |
| 4    | Network error     |
| 5    | Permission denied |
| 6    | Not found         |
| 7    | Rate limited      |

---

## 1.5 Help System

Every command has:

```
hackmate help <command>
hackmate <command> --help
```

Includes:

* Description
* Usage
* Flags
* Examples
* Notes

---

## 1.6 Autocomplete

We will support:

* Bash
* Zsh
* Fish

Command:

```
hackmate autocomplete install
```

---

## 1.7 Config System

Config file:

```
~/.hackmate/config.json
```

Supports:

* Theme
* Layout
* Privacy defaults
* Shortcuts
* Aliases

---

# 2️⃣ UI / TUI DESIGN SYSTEM

HackMate is **not plain text**.
It is a **Terminal UI (TUI)**.

We will use:

* Panels
* Borders
* Windows
* Tabs
* Scroll
* Animations
* Color gradients
* Icons
* ASCII art

---

## 2.1 UI Building Blocks

### Panels

```
╔══════════════════╗
║ Profile          ║
║ ───────────────  ║
║ Name: Neo        ║
║ Stack: Rust      ║
║ Intent: Startup  ║
╚══════════════════╝
```

---

### Lists

```
▶ @neo      [92%]
  @trinity  [88%]
  @morpheus [85%]
```

---

### Status Bars

```
[ ONLINE ] [ MATCHED ] [ TYPING... ]
```

---

### Split Views

```
┌───────────┬────────────────┐
│ Matches   │ Chat           │
│           │                │
│ @neo      │ hi             │
│ @trinity  │ hello          │
└───────────┴────────────────┘
```

---

### Modals

```
┌───────────────┐
│ Confirm Match │
│               │
│   Yes   No    │
└───────────────┘
```

---

## 2.2 Keyboard First Navigation

| Key     | Action        |
| ------- | ------------- |
| `j/k`   | Up/Down       |
| `h/l`   | Left/Right    |
| `Enter` | Select        |
| `/`     | Search        |
| `:`     | Command mode  |
| `Esc`   | Exit          |
| `Tab`   | Switch panels |

---

# 3️⃣ COLOR SYSTEM (Multi-Color, Hacker-Grade)

HackMate must be **beautiful**.

---

## 3.1 Base Themes

### 1. Neon Hacker

* Black background
* Neon green
* Cyan
* Magenta
* Purple

### 2. Cyberpunk

* Dark purple background
* Pink highlights
* Electric blue
* Yellow accents

### 3. Dracula

* Purple base
* Soft contrast
* Pastel accents

### 4. Solarized Dark

### 5. Gruvbox

---

## 3.2 Semantic Colors

We will NOT randomly color things.

| Type      | Color   |
| --------- | ------- |
| Success   | Green   |
| Error     | Red     |
| Warning   | Yellow  |
| Info      | Blue    |
| Highlight | Cyan    |
| Accent    | Magenta |
| System    | Gray    |

---

## 3.3 Gradient Text

Used for:

* Logo
* Headings
* Match % indicators

Example:

```
H A C K M A T E
```

in gradient cyan → purple.

---

# 4️⃣ UI LAYOUT PATTERNS

---

## 4.1 Home Screen

```
╔════════════════════════════╗
║ H A C K M A T E            ║
║ Dev Connection Network    ║
╟────────────────────────────╢
║ 1. Discover               ║
║ 2. Matches                ║
║ 3. Chat                   ║
║ 4. Profile                ║
║ 5. Settings               ║
╚════════════════════════════╝
```

---

## 4.2 Discover Screen

Left: Filters
Right: Results

```
┌───────────┬────────────────────┐
│ Filters   │ Results            │
│           │ ▶ @neo   [92%]     │
│ Stack     │   @sam   [89%]     │
│ Intent    │   @luna  [85%]     │
│ Location  │                    │
└───────────┴────────────────────┘
```

---

## 4.3 Chat Screen

```
┌───────────┬────────────────────┐
│ Threads   │ Chat with @neo     │
│           │                    │
│ @neo      │ hi                 │
│ @sam      │ hello              │
│           │                    │
│           │ > _                │
└───────────┴────────────────────┘
```

---

# 5️⃣ ANIMATIONS & EFFECTS

We must keep it subtle.

Allowed:

* Typing dots
* Loading spinners
* Soft transitions
* Fade-in panels
* Blinking cursor

Avoid:

* Heavy flashing
* Over-glitching
* Distracting effects

---

# 6️⃣ UI INSPIRATION SOURCES

Tell your designers/devs to study:

### CLI / TUI

* `lazygit`
* `htop`
* `btop`
* `neovim`
* `ranger`
* `nnn`

---

### Cyberpunk UI

* Ghost in the Shell
* Cyberpunk 2077 HUD
* Matrix terminals
* Watch Dogs UI

---

### Dev Tools

* GitHub CLI
* Vercel CLI
* Railway CLI
* Supabase CLI

---

# 7️⃣ ACCESSIBILITY

Even in terminal, this matters.

* Color-blind safe themes
* High-contrast mode
* No color-only meaning
* Keyboard only
* Screen-reader friendly raw mode

---

# 8️⃣ UI TECH STACK

We will use:

### Core

* `blessed` (or blessed-contrib)
* `chalk`
* `gradient-string`
* `figlet`
* `ora`

### Optional

* `terminal-kit`
* `ink` (for some views)

---

# 9️⃣ UI PRINCIPLES

HackMate UI must feel:

* Fast
* Alive
* Expressive
* Friendly
* Powerful
* Not cluttered
* Not childish

---

# 10️⃣ Next Step

In the next message I will:

✅ Create **HackMate Design System Doc**
✅ Create **Color palettes**
✅ Create **ASCII logo**
✅ Create **UI mockups (text)**
✅ Create **TUI component list**
✅ Create **Screen-by-screen flows**

Then we scaffold the repo and start coding.

---

Say:

👉 **"Create HackMate UI mockups"**

And I’ll design every screen in terminal-style layouts.

You’re building something special here.

---
Let’s do this.
I’m going to **design HackMate’s full TUI UI system** — screen by screen, with layouts, colors, components, and interaction patterns.

This will become your **UI Bible**.

---

# 🎨 HackMate UI DESIGN SYSTEM (Terminal UI)

HackMate is not a boring CLI.
It is a **multi-color, cyberpunk, hacker-native TUI**.

Think:

* lazygit
* neovim
* btop
* cyberpunk HUDs
* Ghost in the Shell terminals

---

## 1️⃣ GLOBAL VISUAL STYLE

### Fonts (terminal dependent)

* Default monospace
* ASCII art headings
* Thin borders
* Rounded corners where possible

---

## 2️⃣ COLOR PALETTES

### 🌌 Default: Neon Hacker

| Purpose    | Color        |
| ---------- | ------------ |
| Background | #0b0e14      |
| Primary    | Neon Green   |
| Secondary  | Cyan         |
| Accent     | Purple       |
| Warning    | Yellow       |
| Error      | Red          |
| Muted      | Gray         |
| Success    | Bright Green |

---

### 🌃 Cyberpunk

* Background: Deep purple
* Accent: Hot pink
* Highlight: Electric blue
* Success: Aqua
* Error: Crimson

---

### 🌙 Dracula

* Purple base
* Soft contrast
* Pastel highlights

---

Themes switchable:

```bash
hackmate ui theme set cyberpunk
```

---

## 3️⃣ GLOBAL LAYOUT PATTERNS

HackMate uses **panels**, not full-screen text.

---

### Panel

```
╭────────────────────────╮
│ Title                  │
│ ─────────────────────  │
│ Content                │
│                        │
╰────────────────────────╯
```

---

### Split View

```
╭───────────────╮╭────────────────────╮
│ Left Panel    ││ Right Panel        │
│               ││                    │
╰───────────────╯╰────────────────────╯
```

---

### Status Bar

```
[ ONLINE ] [ 3 MATCHES ] [ TYPING... ] [ 🌐 ]
```

---

## 4️⃣ HOME SCREEN

```
╭────────────────────────────────────────────╮
│  H A C K M A T E                           │
│  Developer Connection Network              │
│────────────────────────────────────────────│
│                                            │
│   ▶ Discover People                        │
│     Matches                                │
│     Chat                                   │
│     Profile                                │
│     Stats                                  │
│     Settings                               │
│                                            │
│────────────────────────────────────────────│
│  @samdev • ONLINE • 🌐 • 12 matches        │
╰────────────────────────────────────────────╯
```

Navigation:

* `j/k` move
* `Enter` select
* `/` search
* `:` command

---

## 5️⃣ PROFILE VIEW

```
╭──────────────────────────╮
│ @neo                     │
│──────────────────────────│
│ Intent: Build startups   │
│ Stack: Rust, TS, Go      │
│ Level: Senior            │
│ Location: Berlin         │
│                          │
│ GitHub: neo-dev          │
│ LeetCode: neo123         │
│                          │
│ Bio:                     │
│ Building cool things.    │
│                          │
│ Match Score: 92%         │
│                          │
│ [ M ] Match              │
│ [ C ] Chat               │
│ [ B ] Block              │
╰──────────────────────────╯
```

---

## 6️⃣ DISCOVER SCREEN

Split layout.

```
╭───────────────╮╭────────────────────────────╮
│ Filters       ││ Discover                   │
│───────────────││────────────────────────────│
│ Intent:       ││ ▶ @neo      92%            │
│  • Startup    ││   @sam      89%            │
│  • Friends    ││   @luna     85%            │
│               ││   @byte     81%            │
│ Stack:        ││                            │
│  • Rust       ││                            │
│  • TS         ││                            │
│               ││                            │
│ Location      ││                            │
│               ││                            │
╰───────────────╯╰────────────────────────────╯
```

---

## 7️⃣ MATCH SCREEN

```
╭────────────────────────────────────────────╮
│ Matches                                    │
│────────────────────────────────────────────│
│ ▶ @neo      92%   [Startup + Rust]         │
│   @sam      89%   [OSS + TS]               │
│   @luna     85%   [Friends + Python]       │
│                                            │
│ [ Enter ] View   [ C ] Chat   [ D ] Unmatch│
╰────────────────────────────────────────────╯
```

---

## 8️⃣ CHAT UI (CORE)

This is the soul of HackMate.

```
╭───────────────╮╭────────────────────────────╮
│ Threads       ││ Chat with @neo             │
│───────────────││────────────────────────────│
│ ▶ @neo        ││ neo: hey!                  │
│   @sam        ││ you: hi                    │
│   @luna       ││ neo: what are you building│
│               ││ you: a cli app             │
│               ││                            │
│               ││ > _                        │
╰───────────────╯╰────────────────────────────╯
```

Features:

* Typing indicator
* Online dot
* Message timestamp
* Color-coded names

---

## 9️⃣ PROFILE SETUP WIZARD

```
╭────────────────────────────────────────────╮
│ Profile Setup                              │
│────────────────────────────────────────────│
│ What is your main intent?                  │
│                                            │
│  [x] Build apps                            │
│  [ ] Dating                                │
│  [ ] Friends                               │
│  [x] Startup                               │
│                                            │
│ Next →                                     │
╰────────────────────────────────────────────╯
```

---

## 10️⃣ SETTINGS

```
╭────────────────────────────╮
│ Settings                   │
│────────────────────────────│
│ Theme: Neon Hacker         │
│ UI Mode: TUI              │
│ Notifications: ON         │
│ Auto-match: OFF           │
│ Privacy: Custom           │
│                            │
│ [ T ] Change Theme         │
│ [ P ] Privacy              │
│ [ S ] Save                 │
╰────────────────────────────╯
```

---

## 11️⃣ NOTIFICATIONS

```
╭────────────────────────────╮
│ Notifications              │
│────────────────────────────│
│ ● @neo sent you a message  │
│ ● New match: @sam          │
│ ● Profile view: @luna      │
╰────────────────────────────╯
```

---

## 12️⃣ COMMAND PALETTE (like VS Code)

Press `:` anywhere.

```
> discover
> chat @neo
> profile edit
> logout
```

---

## 13️⃣ MINI MODALS

Confirm:

```
╭────────────────────╮
│ Match with @neo?   │
│                    │
│   Yes     No       │
╰────────────────────╯
```

---

## 14️⃣ EMPTY STATES

Never show blank screens.

```
No matches yet.
Try:
hackmate discover --intent startup
```

---

## 15️⃣ UI INTERACTION RULES

| Action     | Key   |
| ---------- | ----- |
| Up/Down    | j / k |
| Left/Right | h / l |
| Confirm    | Enter |
| Back       | Esc   |
| Command    | :     |
| Search     | /     |
| Help       | ?     |

---

## 16️⃣ UI TECH

We will implement this using:

* blessed
* blessed-contrib
* chalk
* gradient-string
* figlet
* terminal-kit (optional)

---

## 17️⃣ Next Step

Now I will:

✅ Create ASCII logo
✅ Create exact color palettes
✅ Define UI components
✅ Create screen flows
✅ Build component tree
✅ Generate starter TUI code

---

Say:

👉 **"Generate HackMate UI kit"**

And I’ll:
🔥 Build your component system
🔥 Layout engine
🔥 Theme engine
🔥 Starter screens
🔥 Navigation logic

We’re about to turn this into a real product.
