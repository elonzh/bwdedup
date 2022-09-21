import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'

// https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
// antd/lib/style/themes/default.less
const bitwardenPrimaryColor = "#175ddc"
const themes = {
  "primary-color": bitwardenPrimaryColor,
  "layout-header-background": bitwardenPrimaryColor,
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themes,
      },
    },
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          // style: (name) => `antd/es/${name}/style/css`,
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ]
})
