import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head'; //insere elementos HTML (title)
import Link from 'next/link';

import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

import { api } from '../services/api';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

import { usePLayer } from '../contexts/PlayerContext';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
}
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { playList } = usePLayer();

  const episodeList = [...latestEpisodes, ...allEpisodes] //aqui inserimos todos os episódios do podcast na listagem

  return (
    <div className={styles.homePage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      
      <section className={styles.latestEpisodes}>
        <h2>Newest Episodes</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192} 
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link  href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                  <button type="button" onClick={() => playList(episodeList, index)}>
                    {/*onClick deve receber como parâmetro uma função, e não executar a função play, por isso é necessário o arrow funciont*/}
                    <img src="/play-green.svg" alt="PLay episode"/>
                  </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>All Episodes</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Members</th>
                <th>Date</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72}}>
                      <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100}}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index+latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Play episode"/>
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

//requisição inicial (é executada com prioridade pela função SSG) já retorna objeto tipado e dados formatado
export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const data = await response.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'MMM d, yyyy', { locale: enUS}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  //separação dos dois primeiro dos demais para exibição dos últimos lançamentos utilizando SLICE
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes, 
    },
    revalidate: 60 * 60 * 8, //60 segundos x 60 minutos x 8 horas = 3 requisições durante um dia (24h/8h = 3)
  }
}
