// macOS traffic light offset
if (navigator.userAgent.includes('Mac')) {
  document.body.classList.add('darwin')
}

// ─── Element refs ─────────────────────────────────────────────────────────
const addressInput   = document.getElementById('address-input')
const btnBack        = document.getElementById('btn-back')
const btnForward     = document.getElementById('btn-forward')
const btnReload      = document.getElementById('btn-reload')
const btnNewTab      = document.getElementById('btn-new-tab')
const tabsStrip      = document.getElementById('tabs-strip')
const iconReload     = document.getElementById('icon-reload')
const iconStop       = document.getElementById('icon-stop')
const sectionTabs    = document.querySelectorAll('.section-tab')

let isLoading = false

// ─── Section tabs (My Home / Bizbox / Lifebud) ───────────────────────────
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

// ─── Address bar ─────────────────────────────────────────────────────────
addressInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = addressInput.value.trim()
    if (val) {
      window.thriveos.navigate(val)
      addressInput.blur()
    }
  }
  if (e.key === 'Escape') {
    addressInput.blur()
    window.thriveos.getCurrentUrl().then((url) => { addressInput.value = url })
  }
})

addressInput.addEventListener('focus', () => addressInput.select())

// ─── Nav buttons ─────────────────────────────────────────────────────────
btnBack.addEventListener('click', () => window.thriveos.goBack())
btnForward.addEventListener('click', () => window.thriveos.goForward())
btnReload.addEventListener('click', () => window.thriveos.reload())
btnNewTab.addEventListener('click', () => window.thriveos.newTab())

// ─── Browser tabs rendering ───────────────────────────────────────────────
function renderTabs(tabs) {
  tabsStrip.innerHTML = ''
  tabs.forEach((tab) => {
    const el = document.createElement('div')
    el.className = `browser-tab${tab.active ? ' active' : ''}`
    el.dataset.tabId = tab.id

    const loadingEl = tab.loading
      ? `<span class="tab-loading-dot"></span>`
      : ''

    el.innerHTML = `
      ${loadingEl}
      <span class="tab-title">${escapeHtml(tab.title)}</span>
      <button class="tab-close" data-tab-id="${tab.id}" title="Close tab">×</button>
    `

    // Switch tab on click (but not close button)
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close') || e.target.closest('.tab-close')) return
      window.thriveos.switchTab(tab.id)
    })

    // Close tab
    el.querySelector('.tab-close').addEventListener('click', (e) => {
      e.stopPropagation()
      window.thriveos.closeTab(tab.id)
    })

    tabsStrip.appendChild(el)
  })
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Events from main process ─────────────────────────────────────────────
window.thriveos.onUrlChanged((url) => {
  if (document.activeElement !== addressInput) {
    addressInput.value = url
  }
  // Update active section based on URL
  if (url.includes('/dashboard/bizbox')) setActiveSection('bizbox')
  else if (url.includes('/dashboard/lifebud')) setActiveSection('lifebud')
  else if (url.includes('thriveos') || url === 'about:blank') setActiveSection('home')
  else {
    // External page — deselect all section tabs
    sectionTabs.forEach((t) => t.classList.remove('active'))
  }
})

window.thriveos.onNavState((state) => {
  btnBack.disabled    = !state.canGoBack
  btnForward.disabled = !state.canGoForward
})

window.thriveos.onLoading((loading) => {
  isLoading = loading
  if (loading) {
    iconReload.classList.add('hidden')
    iconStop.classList.remove('hidden')
    btnReload.classList.add('loading')
    btnReload.title = 'Stop'
  } else {
    iconStop.classList.add('hidden')
    iconReload.classList.remove('hidden')
    btnReload.classList.remove('loading')
    btnReload.title = 'Reload'
  }
})

window.thriveos.onTabsChanged((tabs) => {
  renderTabs(tabs)
})

// Listen for active section changes triggered by main process (e.g. go-home)
if (window.thriveos.onActiveSection) {
  window.thriveos.onActiveSection((section) => setActiveSection(section))
}
