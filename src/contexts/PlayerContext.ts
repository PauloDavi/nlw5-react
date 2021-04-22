import { createContext } from 'react'

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
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
  play: (episode: EpisodeProps) => void
}

export const PlayerContext = createContext({} as PlayerContextProps)
