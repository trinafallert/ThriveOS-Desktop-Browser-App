import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: 'dist',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'ThriveOS Assistant',
    action: {
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
      default_title: 'ThriveOS Assistant',
    },
    options_ui: {
      page: 'app.html#/settings',
      open_in_tab: true,
    },
    permissions: [
      'topSites',
      'storage',
      'unlimitedStorage',
      'scripting',
      'tabs',
      'tabGroups',
      'sidePanel',
      'bookmarks',
      'history',
      'alarms',
      'webNavigation',
      'downloads',
    ],
    host_permissions: [
      'http://127.0.0.1/*',
      'https://suggestqueries.google.com/*',
      'https://api.bing.com/*',
      'https://in.search.yahoo.com/*',
      'https://duckduckgo.com/*',
      'https://search.brave.com/*',
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
