import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import ReactTooltip from 'react-tooltip'

import { usePlayer } from '../contexts/PlayerContext'
import { api } from '../service/api'
import styles from '../styles/home.module.scss'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

interface ConvertedEpisodeProps {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
}

interface HomeProps {
  latestEpisodes: ConvertedEpisodeProps[]
  allEpisodes: ConvertedEpisodeProps[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { playList, togglePlay, currentEpisodeId, isPlaying } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <ReactTooltip effect="solid" backgroundColor="rgba(0, 0, 0, 0.7)" place="bottom" />

      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            const isEpisodePlaying = currentEpisodeId === episode.id && isPlaying

            return (
              <li key={episode.id}>
                <Image
                  priority
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={192}
                  height={192}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p data-tip={episode.members}>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  className={isEpisodePlaying ? styles.pauseIconButton : ''}
                  data-tip={isEpisodePlaying ? 'Pausar episódio' : 'Tocar episódio'}
                  onClick={() => {
                    if (isEpisodePlaying) {
                      togglePlay()
                    } else {
                      playList(episodeList, index)
                    }
                  }}
                  type="button"
                >
                  {isEpisodePlaying ? (
                    <img src="/pause.svg" alt="Pausar episódio" />
                  ) : (
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              const isEpisodePlaying = currentEpisodeId === episode.id && isPlaying

              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image width={72} height={72} src={episode.thumbnail} alt={episode.title} />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      className={isEpisodePlaying ? styles.pauseIconButton : ''}
                      data-tip={isEpisodePlaying ? 'Pausar episódio' : 'Tocar episódio'}
                      onClick={() => {
                        if (isEpisodePlaying) {
                          togglePlay()
                        } else {
                          playList(episodeList, index + latestEpisodes.length)
                        }
                      }}
                      type="button"
                    >
                      {isEpisodePlaying ? (
                        <img className="green-icon" src="/pause.svg" alt="Pausar episódio" />
                      ) : (
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // Eight hours between validations
  }
}
