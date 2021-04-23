import { useEffect, useState, createContext, ReactNode, useContext } from 'react'

interface EpisodeProps {
  id: string
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextProps {
  episodeList: EpisodeProps[]
  currentEpisodeIndex: number
  isPlaying: boolean
  currentEpisodeId: string
  hasPrevious: boolean
  hasNext: boolean
  isLooping: boolean
  isShuffling: boolean
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
  toggleShuffle: () => void
  toggleLoop: () => void
  playNext: () => void
  playPrevious: () => void
  play: (episode: EpisodeProps) => void
  playList: (episode: EpisodeProps[], index: number) => void
}

interface PlayerContextProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextProps)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [episodeList, setEpisodeList] = useState<EpisodeProps[]>([])
  const [orderEpisodeList, setOrderEpisodeList] = useState<EpisodeProps[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [currentEpisodeId, setCurrentEpisodeId] = useState('')

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = currentEpisodeIndex < episodeList.length - 1

  useEffect(() => {
    if (!episodeList || episodeList.length === 0) {
      return
    }

    setCurrentEpisodeId(episodeList[currentEpisodeIndex].id)
  }, [setCurrentEpisodeId, episodeList, currentEpisodeIndex])

  function play(episode: EpisodeProps) {
    setEpisodeList([episode])
    setOrderEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: EpisodeProps[], index: number) {
    setEpisodeList(list)
    setOrderEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying((e) => !e)
  }

  function toggleLoop() {
    setIsLooping((e) => !e)
  }

  function toggleShuffle() {
    setIsShuffling((e) => {
      if (e) {
        const correctIndex = orderEpisodeList.findIndex(
          (episode) => episode.id === episodeList[currentEpisodeIndex].id
        )
        setEpisodeList(orderEpisodeList)
        setCurrentEpisodeIndex(correctIndex)

        return false
      }

      const restOfEpisodes = episodeList.slice(currentEpisodeIndex + 1, episodeList.length)
      const passedEpisodes = episodeList.slice(0, currentEpisodeIndex + 1)

      for (let i = restOfEpisodes.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * i)
        const temp = restOfEpisodes[i]
        restOfEpisodes[i] = restOfEpisodes[j]
        restOfEpisodes[j] = temp
      }

      setEpisodeList([...passedEpisodes, ...restOfEpisodes])

      return true
    })
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function playNext() {
    setCurrentEpisodeIndex((e) => {
      const nextEpisodeIndex = e + 1

      if (nextEpisodeIndex >= episodeList.length) {
        return e
      }

      return nextEpisodeIndex
    })
  }

  function playPrevious() {
    setCurrentEpisodeIndex((e) => {
      if (e <= 0) {
        return 0
      }

      return e - 1
    })
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        isPlaying,
        currentEpisodeId,
        hasPrevious,
        hasNext,
        isLooping,
        isShuffling,
        toggleShuffle,
        toggleLoop,
        setPlayingState,
        togglePlay,
        play,
        playList,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
