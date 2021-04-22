import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import ReactTooltip from 'react-tooltip'

import { PlayerContext } from '../../contexts/PlayerContext'
import { api } from '../../service/api'
import styles from '../../styles/episode.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

interface ConvertedEpisodeProps {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  description: string
  url: string
  publishedAt: string
}

interface EpisodeProps {
  episode: ConvertedEpisodeProps
}

export default function Episode({ episode }: EpisodeProps) {
  const { play, togglePlay, currentEpisodeId, isPlaying } = useContext(PlayerContext)

  const isEpisodePlaying = currentEpisodeId === episode.id && isPlaying

  return (
    <div className={styles.episodeContainer}>
      <ReactTooltip effect="solid" backgroundColor="rgba(0, 0, 0, 0.7)" place="bottom" />

      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button data-tip="Voltar" type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>

          <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />

          <button
            data-tip={isEpisodePlaying ? 'Pausar episódio' : 'Tocar episódio'}
            onClick={() => {
              if (isEpisodePlaying) {
                togglePlay()
              } else {
                play(episode)
              }
            }}
            type="button"
          >
            {isEpisodePlaying ? (
              <img src="/pause.svg" alt="Pausar episódio" />
            ) : (
              <img src="/play.svg" alt="Tocar episódio" />
            )}
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    description: data.description,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    duration: Number(data.file.duration),
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
