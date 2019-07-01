import store from './store'

export default {
  usePlugin (plugins = {}) {
    Object.keys(plugins).forEach((p) => {
      this.plugins[p] = plugins[p]({ plugins: this.plugins, store })
    })
  },
  plugins: {},
}
