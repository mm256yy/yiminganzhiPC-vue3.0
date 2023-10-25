import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import VueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import PurgeIcons from 'vite-plugin-purge-icons'
import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import VueMarcos from 'unplugin-vue-macros/vite'

// https://vitejs.dev/config/
const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue(),
      VueJsx(),
      WindiCSS(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [{
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name) => {
            return `element-plus/es/components/${name.substring(3)}/style/css`
          }
        }]
      }),
      EslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
      }),
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__dirname, 'src/locales/**')]
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      }),
      PurgeIcons(),
      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: false,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'
          setupProdMockServer()
          `
      }),
      VueMarcos(),
      createHtmlPlugin({
        pages: [
          {
            entry: 'src/main.ts',
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: {
                title: env.VITE_APP_TITLE,
                mapAk: env.VITE_MAP_AK,
                injectScript: `<script src="./inject.js"></script>`,
              }
            }
          },
          {
            entry: 'src/admin/main.ts',
            filename: 'admin.html',
            template: 'admin.html',
            injectOptions: {
              data: {
                title: env.VITE_APP_TITLE,
                mapAk: env.VITE_MAP_AK,
                injectScript: `<script src="./inject.js"></script>`,
              }
            }
          },
          {
            entry: 'src/h5/main.ts',
            filename: 'h5.html',
            template: 'h5.html',
            injectOptions: {
              data: {
                title: env.VITE_APP_TITLE,
                mapAk: env.VITE_MAP_AK,
                injectScript: `<script src="./inject.js"></script>`,
              }
            }
          }
        ]
      })
    ],

    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        },
        {
          find: /\@h5\//,
          replacement: `${pathResolve('src/h5')}/`
        },
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          admin: resolve(__dirname, "admin.html"),
          h5: resolve(__dirname, "h5.html")
        }
      }
    },
    server: {
      port: 4000,
      open: '/',
      proxy: {
        // 选项写法
        '/api': {
          // 本地开后台环境
          target: 'http://192.168.1.119:8880',
          // 线上测试环境
          // target: 'https://r7r-ai.zdwp.net',
          // target: 'https://ym.zhym.net.cn',
          // 使用本地后台服务里，下面该值设置成 false
          changeOrigin: true
        }
      },
      hmr: {
        overlay: false
      },
      host: '0.0.0.0'
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        '@iconify/iconify',
        '@vueuse/core',
        'axios',
        'qs',
        'echarts',
        'intro.js',
        'qrcode',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        'print-js',
        '@amap/amap-jsapi-loader',
        'dayjs' 
      ]
    }
  }
}
