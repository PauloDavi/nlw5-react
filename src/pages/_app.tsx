import { AppProps } from 'next/dist/next-server/lib/router/router';
import NProgress from 'nprogress'
import { Router } from 'next/dist/client/router'
import { useEffect, useState } from 'react';

import '../styles/globals.scss'
import 'nprogress/nprogress.css'
import styles from '../styles/app.module.scss'

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContext } from "../contexts/PlayerContext";

interface EpisodeProps {
  id: string
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

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
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [episodeList, setEpisodeList] = useState<EpisodeProps[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisodeId, setCurrentEpisodeId] = useState('')

  useEffect(() => {
    if(!episodeList || episodeList.length === 0) {
      return
    }
    console.log(episodeList)

    setCurrentEpisodeId(episodeList[currentEpisodeIndex].id)
  }, [setCurrentEpisodeId, episodeList, currentEpisodeIndex])

  function play(episode: EpisodeProps) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(e => !e)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{
      currentEpisodeIndex,
      episodeList,
      isPlaying,
      currentEpisodeId,
      setPlayingState,
      togglePlay,
      play
    }}>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps}/>
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
