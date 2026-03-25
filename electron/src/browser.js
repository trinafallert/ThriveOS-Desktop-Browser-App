// macOS traffic light offset
if (navigator.userAgent.includes('Mac')) {
  document.body.classList.add('darwin')
}

// ─── Element refs ─────────────────────────────────────────────────────────
const addressInput    = document.getElementById('address-input')
const btnBack         = document.getElementById('btn-back')
const btnForward      = document.getElementById('btn-forward')
const btnReload       = document.getElementById('btn-reload')
const btnNewTab       = document.getElementById('btn-new-tab')
const tabsStrip       = document.getElementById('tabs-strip')
const iconReload      = document.getElementById('icon-reload')
const iconStop        = document.getElementById('icon-stop')
const sectionTabs     = document.querySelectorAll('.section-tab')

// Command Palette
const cmdPalette      = document.getElementById('command-palette')
const paletteBackdrop = document.getElementById('palette-backdrop')
const paletteInput    = document.getElementById('palette-input')
const paletteResults  = document.getElementById('palette-results')
const btnCommand      = document.getElementById('btn-command')

// Quick Clip
const clipPanel       = document.getElementById('clip-panel')
const clipBackdrop    = document.getElementById('clip-backdrop')
const btnClip         = document.getElementById('btn-clip')
const clipClose       = document.getElementById('clip-close')
const clipUrlDisplay  = document.getElementById('clip-url-display')
const clipNote        = document.getElementById('clip-note')
const clipToBizbox    = document.getElementById('clip-to-bizbox')
const clipToLifebud   = document.getElementById('clip-to-lifebud')

// AI Sidebar
const aiSidebar       = document.getElementById('ai-sidebar')
const btnAi           = document.getElementById('btn-ai')
const aiSidebarClose  = document.getElementById('ai-sidebar-close')
const aiMessages      = document.getElementById('ai-messages')
const aiInput         = document.getElementById('ai-input')
const aiSend          = document.getElementById('ai-send')
const aiSummarize     = document.getElementById('ai-summarize')
const aiToBizbox      = document.getElementById('ai-to-bizbox')
const aiToLifebud     = document.getElementById('ai-to-lifebud')

// Focus Mode
const btnFocus        = document.getElementById('btn-focus')
const focusBanner     = document.getElementById('focus-banner')
const focusExit       = document.getElementById('focus-exit')

// Toast
const toastEl         = document.getElementById('toast')

let isLoading    = false
let aiOpen       = false
let focusActive  = false
let currentUrl   = ''
let toastTimer   = null

// ─── TOAST ────────────────────────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  clearTimeout(toastTimer)
  toastEl.textContent = msg
  toastEl.classList.remove('hidden')
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), duration)
}

// ─── Section tabs ─────────────────────────────────────────────────────────
sectionTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const section = tab.dataset.section
    window.thriveos.goToSection(section)
    setActiveSection(section)
  })
})

function setActiveSection(section) {
  sectionTabs.forEach((t) => t.classList.toggle('active', t.dataset.section === section))
}

// ─── Address bar ──────────────────────────────────────────────────────────
addressInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = addressInput.value.trim()
    if (val) { window.thriveos.navigate(val); addressInput.blur() }
  }
  if (e.key === 'Escape') {
    addressInput.blur()
    window.thriveos.getCurrentUrl().then((url) => { addressInput.value = url })
  }
})

addressInput.addEventListener('focus', () => addressInput.select())

// ─── Nav buttons ──────────────────────────────────────────────────────────
btnBack.addEventListener('click', () => window.thriveos.goBack())
btnForward.addEventListener('click', () => window.thriveos.goForward())
btnReload.addEventListener('click', () => {
  if (isLoading) window.thriveos.stop()
  else window.thriveos.reload()
})
btnNewTab.addEventListener('click', () => window.thriveos.newTab())

// ─── Browser tabs rendering ───────────────────────────────────────────────
function renderTabs(tabs) {
  tabsStrip.innerHTML = ''
  tabs.forEach((tab) => {
    const el = document.createElement('div')
    el.className = `browser-tab${tab.active ? ' active' : ''}`
    el.dataset.tabId = tab.id

    el.innerHTML = `
      ${tab.loading ? '<span class="tab-loading-dot"></span>' : ''}
      <span class="tab-title">${escapeHtml(tab.title)}</span>
      <button class="tab-close" data-tab-id="${tab.id}" title="Close tab">×</button>
    `

    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close') || e.target.closest('.tab-close')) return
      window.thriveos.switchTab(tab.id)
    })

    el.querySelector('.tab-close').addEventListener('click', (e) => {
      e.stopPropagation()
      window.thriveos.closeTab(tab.id)
    })

    tabsStrip.appendChild(el)
  })
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────
const PALETTE_COMMANDS = [
  { group: 'Navigate', icon: 'purple', emoji: '🏠', title: 'My Home', sub: 'Go to your ThriveOS home', action: () => window.thriveos.goToSection('home'), kbd: '⌘H' },
  { group: 'Navigate', icon: 'blue',   emoji: '💼', title: 'Bizbox', sub: 'Business command center', action: () => window.thriveos.goToSection('bizbox'), kbd: '⌘B' },
  { group: 'Navigate', icon: 'pink',   emoji: '💚', title: 'Lifebud', sub: 'Life goals & habits', action: () => window.thriveos.goToSection('lifebud'), kbd: '⌘L' },
  { group: 'Actions',  icon: 'gray',   emoji: '➕', title: 'New Tab', sub: 'Open a new browser tab', action: () => window.thriveos.newTab(), kbd: '⌘T' },
  { group: 'Actions',  icon: 'green',  emoji: '🎯', title: 'Focus Mode', sub: 'Enter distraction-free mode', action: toggleFocusMode, kbd: '⌘⇧F' },
  { group: 'Actions',  icon: 'purple', emoji: '✂️', title: 'Clip to ThriveOS', sub: 'Save this page to Bizbox or Lifebud', action: openClipPanel, kbd: '⌘⇧S' },
  { group: 'Actions',  icon: 'purple', emoji: '🤖', title: 'Open AI Assistant', sub: 'Chat with ThriveOS AI', action: toggleAiSidebar, kbd: '⌘\\' },
  { group: 'Navigate', icon: 'gray',   emoji: '⚙️', title: 'Settings', sub: 'App settings & subscription', action: () => { window.thriveos.navigate('thriveos-settings'); closePalette() } },
]

let paletteSelectedIdx = 0
let paletteFiltered = [...PALETTE_COMMANDS]

function openPalette() {
  cmdPalette.classList.remove('hidden')
  paletteInput.value = ''
  paletteSelectedIdx = 0
  paletteFiltered = [...PALETTE_COMMANDS]
  renderPalette()
  setTimeout(() => paletteInput.focus(), 10)
}

function closePalette() {
  cmdPalette.classList.add('hidden')
  paletteInput.value = ''
}

function renderPalette() {
  paletteResults.innerHTML = ''
  if (paletteFiltered.length === 0) {
    paletteResults.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-dim);font-size:13px">No results</div>'
    return
  }

  const groups = [...new Set(paletteFiltered.map(c => c.group))]
  let itemIdx = 0

  groups.forEach(group => {
    const groupItems = paletteFiltered.filter(c => c.group === group)
    const label = document.createElement('div')
    label.className = 'palette-group-label'
    label.textContent = group
    paletteResults.appendChild(label)

    groupItems.forEach(cmd => {
      const el = document.createElement('div')
      const idx = itemIdx++
      el.className = `palette-item${idx === paletteSelectedIdx ? ' selected' : ''}`
      el.dataset.idx = idx
      el.innerHTML = `
        <div class="palette-item-icon ${cmd.icon}">${cmd.emoji}</div>
        <div class="palette-item-text">
          <div class="palette-item-title">${escapeHtml(cmd.title)}</div>
          <div class="palette-item-sub">${escapeHtml(cmd.sub)}</div>
        </div>
        ${cmd.kbd ? `<kbd class="palette-item-kbd">${cmd.kbd}</kbd>` : ''}
      `
      el.addEventListener('click', () => { cmd.action(); closePalette() })
      paletteResults.appendChild(el)
    })
  })
}

paletteInput.addEventListener('input', () => {
  const q = paletteInput.value.toLowerCase().trim()
  paletteFiltered = q
    ? PALETTE_COMMANDS.filter(c =>
        c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
      )
    : [...PALETTE_COMMANDS]
  paletteSelectedIdx = 0
  renderPalette()
})

paletteInput.addEventListener('keydown', (e) => {
  const items = paletteResults.querySelectorAll('.palette-item')
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    paletteSelectedIdx = Math.min(paletteSelectedIdx + 1, paletteFiltered.length - 1)
    renderPalette()
    paletteResults.querySelector('.selected')?.scrollIntoView({ block: 'nearest' })
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    paletteSelectedIdx = Math.max(paletteSelectedIdx - 1, 0)
    renderPalette()
    paletteResults.querySelector('.selected')?.scrollIntoView({ block: 'nearest' })
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = paletteFiltered[paletteSelectedIdx]
    if (cmd) { cmd.action(); closePalette() }
  } else if (e.key === 'Escape') {
    closePalette()
  }
})

btnCommand.addEventListener('click', openPalette)
paletteBackdrop.addEventListener('click', closePalette)

// ─── QUICK CLIP ───────────────────────────────────────────────────────────
function openClipPanel() {
  clipPanel.classList.remove('hidden')
  clipUrlDisplay.textContent = currentUrl || 'No page loaded'
  clipNote.value = ''
  setTimeout(() => clipNote.focus(), 10)
}

function closeClipPanel() {
  clipPanel.classList.add('hidden')
}

btnClip.addEventListener('click', openClipPanel)
clipClose.addEventListener('click', closeClipPanel)
clipBackdrop.addEventListener('click', closeClipPanel)

clipToBizbox.addEventListener('click', () => {
  const note = clipNote.value.trim()
  const msg = note ? `Clipped to Bizbox — "${note}"` : 'Saved to Bizbox'
  closeClipPanel()
  showToast(`💼 ${msg}`)
  window.thriveos.clipToSection('bizbox', currentUrl, note)
})

clipToLifebud.addEventListener('click', () => {
  const note = clipNote.value.trim()
  const msg = note ? `Clipped to Lifebud — "${note}"` : 'Saved to Lifebud'
  closeClipPanel()
  showToast(`💚 ${msg}`)
  window.thriveos.clipToSection('lifebud', currentUrl, note)
})

// ─── AI SIDEBAR ───────────────────────────────────────────────────────────
function toggleAiSidebar() {
  aiOpen = !aiOpen
  if (aiOpen) {
    aiSidebar.classList.remove('hidden')
    btnAi.classList.add('active')
    setTimeout(() => aiInput.focus(), 100)
  } else {
    aiSidebar.classList.add('hidden')
    btnAi.classList.remove('active')
  }
}

btnAi.addEventListener('click', toggleAiSidebar)
aiSidebarClose.addEventListener('click', () => { aiOpen = false; aiSidebar.classList.add('hidden'); btnAi.classList.remove('active') })

function addAiMessage(text, role = 'bot') {
  const msg = document.createElement('div')
  msg.className = `ai-msg ai-msg-${role}`
  if (role === 'bot') {
    msg.innerHTML = `
      <div class="ai-avatar">AI</div>
      <div class="ai-bubble">${escapeHtml(text)}</div>
    `
  } else {
    msg.innerHTML = `<div class="ai-bubble">${escapeHtml(text)}</div>`
  }
  aiMessages.appendChild(msg)
  aiMessages.scrollTop = aiMessages.scrollHeight
  return msg
}

function addAiTyping() {
  const msg = document.createElement('div')
  msg.className = 'ai-msg ai-msg-bot ai-typing'
  msg.innerHTML = `
    <div class="ai-avatar">AI</div>
    <div class="ai-bubble">
      <div class="ai-typing-dots"><span></span><span></span><span></span></div>
    </div>
  `
  aiMessages.appendChild(msg)
  aiMessages.scrollTop = aiMessages.scrollHeight
  return msg
}

const AI_RESPONSES = {
  summarize: [
    "Here's what's on this page: it covers key insights relevant to your goals. Want me to save the highlights to Bizbox or log it to Lifebud?",
    "I've analyzed the page. The main points look useful for your business strategy. Clip it to Bizbox?",
  ],
  bizbox: [
    "Added to your Bizbox tasks. You can see it under Projects when you switch to Bizbox.",
    "I've flagged this for your Bizbox. Check your tasks next time you're in the command center.",
  ],
  lifebud: [
    "Logged to Lifebud. I'll track this as part of your goals and show you progress over time.",
    "Added to your Lifebud journal. Great for keeping up momentum on your life goals.",
  ],
  default: [
    "I'm your ThriveOS OS — connecting your browser to your businesses and life. Ask me anything about Bizbox, Lifebud, or this page.",
    "Got it. I can help you manage your businesses, track life goals, or analyze what you're browsing. What do you need?",
    "Sure thing. I'm watching over your whole ThriveOS — businesses, habits, goals, and everything you browse.",
  ],
}

function getAiResponse(query) {
  const q = query.toLowerCase()
  if (q.includes('summar')) return pick(AI_RESPONSES.summarize)
  if (q.includes('bizbox') || q.includes('business') || q.includes('task')) return pick(AI_RESPONSES.bizbox)
  if (q.includes('lifebud') || q.includes('goal') || q.includes('habit') || q.includes('life')) return pick(AI_RESPONSES.lifebud)
  return pick(AI_RESPONSES.default)
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function sendAiMessage(text) {
  if (!text.trim()) return
  addAiMessage(text, 'user')
  aiInput.value = ''
  const typing = addAiTyping()
  setTimeout(() => {
    typing.remove()
    addAiMessage(getAiResponse(text))
  }, 900 + Math.random() * 600)
}

aiSend.addEventListener('click', () => sendAiMessage(aiInput.value))
aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendAiMessage(aiInput.value) })

aiSummarize.addEventListener('click', () => {
  if (!aiOpen) toggleAiSidebar()
  addAiMessage('Summarize this page', 'user')
  const typing = addAiTyping()
  setTimeout(() => {
    typing.remove()
    addAiMessage(pick(AI_RESPONSES.summarize))
  }, 1200)
})

aiToBizbox.addEventListener('click', () => {
  if (!aiOpen) toggleAiSidebar()
  addAiMessage('Add this page to Bizbox', 'user')
  const typing = addAiTyping()
  setTimeout(() => {
    typing.remove()
    addAiMessage(pick(AI_RESPONSES.bizbox))
    showToast('💼 Added to Bizbox tasks')
    window.thriveos.clipToSection('bizbox', currentUrl, '')
  }, 900)
})

aiToLifebud.addEventListener('click', () => {
  if (!aiOpen) toggleAiSidebar()
  addAiMessage('Log this to Lifebud', 'user')
  const typing = addAiTyping()
  setTimeout(() => {
    typing.remove()
    addAiMessage(pick(AI_RESPONSES.lifebud))
    showToast('💚 Logged to Lifebud')
    window.thriveos.clipToSection('lifebud', currentUrl, '')
  }, 900)
})

// ─── FOCUS MODE ───────────────────────────────────────────────────────────
function toggleFocusMode() {
  focusActive = !focusActive
  document.body.classList.toggle('focus-mode', focusActive)
  btnFocus.classList.toggle('active', focusActive)
  focusBanner.classList.toggle('hidden', !focusActive)
  showToast(focusActive ? '🎯 Focus Mode on — deep work time' : '✓ Focus Mode off')
}

btnFocus.addEventListener('click', toggleFocusMode)
focusExit.addEventListener('click', () => { focusActive = true; toggleFocusMode() })

// ─── GLOBAL KEYBOARD SHORTCUTS ────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey

  if (mod && e.key === 'k') { e.preventDefault(); openPalette(); return }
  if (mod && e.key === '\\') { e.preventDefault(); toggleAiSidebar(); return }
  if (mod && e.shiftKey && e.key === 'S') { e.preventDefault(); openClipPanel(); return }
  if (mod && e.shiftKey && e.key === 'F') { e.preventDefault(); toggleFocusMode(); return }
  if (mod && e.key === 'h') { e.preventDefault(); window.thriveos.goToSection('home'); return }
  if (mod && e.key === 'b') { e.preventDefault(); window.thriveos.goToSection('bizbox'); return }
  if (mod && e.key === 'l') { e.preventDefault(); window.thriveos.goToSection('lifebud'); return }
  if (mod && e.key === 't') { e.preventDefault(); window.thriveos.newTab(); return }
  if (mod && e.key === 'r') { e.preventDefault(); window.thriveos.reload(); return }
  if (e.key === 'Escape') {
    if (!cmdPalette.classList.contains('hidden')) { closePalette(); return }
    if (!clipPanel.classList.contains('hidden')) { closeClipPanel(); return }
    if (aiOpen) { toggleAiSidebar(); return }
    if (focusActive) { focusActive = true; toggleFocusMode(); return }
  }
})

// ─── Events from main process ─────────────────────────────────────────────
window.thriveos.onUrlChanged((url) => {
  currentUrl = url
  if (document.activeElement !== addressInput) addressInput.value = url

  if (url.includes('/dashboard/bizbox')) setActiveSection('bizbox')
  else if (url.includes('/dashboard/lifebud')) setActiveSection('lifebud')
  else if (url.startsWith('file://') || url.includes('thriveos') || url === 'about:blank') setActiveSection('home')
  else sectionTabs.forEach((t) => t.classList.remove('active'))
})

window.thriveos.onNavState((state) => {
  btnBack.disabled    = !state.canGoBack
  btnForward.disabled = !state.canGoForward
})

window.thriveos.onLoading((loading) => {
  isLoading = loading
  if (loading) {
    iconReload.classList.add('hidden'); iconStop.classList.remove('hidden')
    btnReload.classList.add('loading'); btnReload.title = 'Stop'
  } else {
    iconStop.classList.add('hidden'); iconReload.classList.remove('hidden')
    btnReload.classList.remove('loading'); btnReload.title = 'Reload'
  }
})

window.thriveos.onTabsChanged((tabs) => renderTabs(tabs))

if (window.thriveos.onActiveSection) {
  window.thriveos.onActiveSection((section) => setActiveSection(section))
}
