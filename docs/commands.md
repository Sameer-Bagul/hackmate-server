Perfect — here is the **complete CLI command design** for **HackMate**.
This is your **single source of truth** for how the app will be used.

This is long — because this is a **real product**, not a toy.

---

# 🧠 HackMate CLI Command Philosophy

HackMate commands follow:

* Git-style UX
* Composable
* Scriptable
* Keyboard-first
* Power-user friendly
* Human readable

---

# 🏁 Base Command

```bash
hackmate
```

Global flags:

```bash
--help
--version
--json
--debug
--no-color
--config <path>
```

---

# 🔐 AUTH & IDENTITY

```bash
hackmate init
hackmate signup
hackmate login
hackmate logout
hackmate whoami
hackmate auth status
hackmate auth refresh
hackmate auth revoke
hackmate delete-account
```

Flags:

```bash
--username
--password
--token
--anonymous
```

---

# 👤 PROFILE

```bash
hackmate profile setup
hackmate profile edit
hackmate profile view
hackmate profile view @username
hackmate profile delete
hackmate profile export
hackmate profile import
hackmate profile verify
```

### Editable Fields

```bash
--moto
--intent
--stack
--experience
--github
--leetcode
--job
--company
--location
--salary
--bio
--timezone
--availability
--interests
--website
--twitter
--linkedin
--privacy
```

Example:

```bash
hackmate profile edit --github samdev --stack node,go --intent startup
```

---

# 🔍 DISCOVERY

```bash
hackmate discover
hackmate discover smart
hackmate discover nearby
hackmate discover new
hackmate discover trending
hackmate discover active
```

Filters:

```bash
--intent
--stack
--experience
--location
--timezone
--availability
--salary
--github
--leetcode
--company
--job
--remote
--open-to-collab
```

Sorting:

```bash
--sort match
--sort activity
--sort distance
--sort recent
```

Example:

```bash
hackmate discover --intent startup --stack rust --timezone IST
```

---

# 🤝 MATCHING

```bash
hackmate match
hackmate match @username
hackmate matches
hackmate matches pending
hackmate matches sent
hackmate matches received
hackmate unmatch @username
hackmate match explain @username
hackmate match score @username
```

---

# 💬 CHAT

```bash
hackmate chat @username
hackmate inbox
hackmate threads
hackmate thread <id>
hackmate send @username "hello"
hackmate reply <threadId> "hi"
hackmate delete-message <id>
hackmate clear-chat @username
```

Realtime mode:

```bash
hackmate chat --live
hackmate chat --tui
```

---

# 👥 SOCIAL

```bash
hackmate follow @username
hackmate unfollow @username
hackmate followers
hackmate following

hackmate block @username
hackmate unblock @username

hackmate report @username
hackmate mute @username
hackmate unmute @username
```

---

# 🧠 SMART ANALYSIS

```bash
hackmate analyze
hackmate analyze github
hackmate analyze leetcode
hackmate analyze profile
hackmate analyze compatibility @username
```

---

# 📊 STATS

```bash
hackmate stats
hackmate stats profile
hackmate stats matches
hackmate stats chats
hackmate stats activity
```

---

# 🔐 PRIVACY

```bash
hackmate privacy
hackmate privacy view
hackmate privacy set
hackmate privacy reset
```

Fields:

```bash
--salary public|private|matches
--location public|private|matches
--github public|private|matches
--leetcode public|private|matches
--job public|private|matches
--bio public|private|matches
```

---

# 🔔 NOTIFICATIONS

```bash
hackmate notifications
hackmate notifications unread
hackmate notifications clear
hackmate notifications mute
hackmate notifications unmute
```

---

# ⚙️ SETTINGS

```bash
hackmate config
hackmate config view
hackmate config set
hackmate config reset
hackmate config edit
```

Options:

```bash
--theme
--ui
--notifications
--auto-match
--auto-discover
--presence
--privacy-default
--cache
```

---

# 🎨 UI / TUI

```bash
hackmate ui
hackmate ui theme
hackmate ui theme list
hackmate ui theme set
hackmate ui layout
hackmate ui preview
```

---

# 📦 DATA

```bash
hackmate export
hackmate import
hackmate backup
hackmate restore
hackmate clear-cache
```

---

# 🧪 DEV / DEBUG

```bash
hackmate doctor
hackmate ping
hackmate status
hackmate logs
hackmate trace
hackmate debug
```

---

# 🔄 UPDATES

```bash
hackmate update
hackmate upgrade
hackmate downgrade
```

---

# 🤖 AUTOMATION

```bash
hackmate bot
hackmate bot enable
hackmate bot disable
hackmate bot status
hackmate bot rules
hackmate bot auto-reply
hackmate bot auto-match
```

---

# 🌐 NETWORK

```bash
hackmate online
hackmate offline
hackmate presence
hackmate presence set
```

---

# 🧩 PLUGINS (Future)

```bash
hackmate plugin install
hackmate plugin remove
hackmate plugin list
hackmate plugin enable
hackmate plugin disable
```

---

# 📖 HELP

```bash
hackmate help
hackmate help discover
hackmate help chat
hackmate help profile
```

---

# ⚡ SHORT ALIASES

```bash
hm
hm d
hm c @neo
hm p view
hm m
```

---

# 🚀 Total Command Count

You now have **100+ commands** designed.

This is a **real CLI ecosystem**, not a toy.

---

# NEXT STEP

In the next message, I will:

✅ Convert this into a **formal CLI spec**
✅ Design command tree
✅ Help texts
✅ Man pages
✅ Autocomplete
✅ Error rules
✅ UX flows

Then:

🔥 Scaffold the repo
🔥 Start coding
🔥 Build MVP

Say:

👉 **"Generate HackMate CLI spec"**

And I’ll do it.
