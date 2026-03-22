// Detect macOS for traffic light offset
if (navigator.userAgent.includes('Mac')) {
  document.body.classList.add('darwin')
}

const input = document.getElementById('address-input')
const btnBack = document.getElementById('btn-back')
const btnForward = document.getElementById('btn-forward')
const btnReload = document.getElementById('btn-reload')
const btnHome = document.getElementById('btn-home')
const iconReload = document.getElementById('icon-reload')
const iconStop = document.getElementById('icon-stop')

let isLoading = false

// Address bar: navigate on Enter
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = input.value.trim()
    if (val) {
      window.thriveos.navigate(val)
      input.blur()
    }
  }
  if (e.key === 'Escape') {
    input.blur()
    // Restore current URL
    window.thriveos.getCurrentUrl().then((url) => {
      input.value = url
    })
  }
})

// Select all on focus
input.addEventListener('focus', () => {
  input.select()
})

// Nav buttons
btnBack.addEventListener('click', () => window.thriveos.goBack())
btnForward.addEventListener('click', () => window.thriveos.goForward())
btnHome.addEventListener('click', () => window.thriveos.goHome())

btnReload.addEventListener('click', () => {
  if (isLoading) {
    window.thriveos.reload() // acts as stop in future — for now reload
  } else {
    window.thriveos.reload()
  }
})

// Receive URL updates from main
window.thriveos.onUrlChanged((url) => {
  // Show clean URL in bar (not when user is typing)
  if (document.activeElement !== input) {
    input.value = url
  }
})

// Nav state (back/forward availability)
window.thriveos.onNavState((state) => {
  btnBack.disabled = !state.canGoBack
  btnForward.disabled = !state.canGoForward
})

// Loading state — swap reload/stop icon
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
