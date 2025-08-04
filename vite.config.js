import { defineConfig } from 'vite'
import { resolve } from 'path'
import vitePluginHtml from 'vite-plugin-html'

export default defineConfig({
    plugins: [
    vitePluginHtml({
        inject: {
        data: {
        title: 'Burgos\'s'
        }
    }
    })
],
    resolve: {
    alias: {
    '@': resolve(__dirname, './src')
    }
}
})