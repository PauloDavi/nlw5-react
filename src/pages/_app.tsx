import { Router } from 'next/dist/client/router'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import NProgress from 'nprogress'

import '../styles/globals.scss'
import 'nprogress/nprogress.css'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContextProvider } from '../contexts/PlayerContext'
import { ThemeContextProvider } from '../contexts/ThemeContext'
import styles from '../styles/app.module.scss'

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 300,
})

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  NProgress.done()
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <PlayerContextProvider>
        <div className={styles.appWrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>

          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeContextProvider>
  )
}

export default MyApp
