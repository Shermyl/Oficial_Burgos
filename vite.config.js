import { defineConfig } from 'vite'
import { resolve } from 'path'
import html from 'vite-plugin-html' // Cambia la importación

export default defineConfig({
    plugins: [
    html({ // Usa el plugin directamente como "html"
        inject: {
        data: {
            title: "Burgos's"
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