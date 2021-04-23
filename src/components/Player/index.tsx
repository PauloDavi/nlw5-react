/* eslint-disable jsx-a11y/media-has-caption */
import classNames from 'classnames'
import Image from 'next/image'
import Slider from 'rc-slider'
import { useEffect, useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'

import { usePlayer } from '../../contexts/PlayerContext'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './styles.module.scss'

import 'rc-slider/assets/index.css'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    toggleShuffle,
    toggleLoop,
    playNext,
    playPrevious,
    togglePlay,
    setPlayingState,
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () =>
      setProgress(Math.floor(audioRef.current.currentTime))
    )
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={classNames(styles.playerContainer, !isOpen && styles.playerHidden)}>
      <ReactTooltip effect="solid" backgroundColor="rgba(0, 0, 0, 0.7)" place="bottom" />

      {/* <button onClick={() => setIsOpen(false)} type="button">
        x
      </button> */}

      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{convertDurationToTimeString(episode?.duration || 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            autoPlay
            onEnded={() => hasNext && playNext()}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            data-tip="Embaralhar"
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
            type="button"
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            disabled={!episode || !hasPrevious}
            data-tip="Anterior"
            type="button"
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            data-tip={isPlaying ? 'Pausar' : 'Tocar'}
            onClick={togglePlay}
            className={styles.playButton}
            disabled={!episode}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            disabled={!episode || !hasNext}
            data-tip="Próximo"
            type="button"
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
            data-tip="Repetir"
            type="button"
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
