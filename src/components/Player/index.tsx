import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); //utilizando ref para alternar status do áudio
  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingStatus } = useContext(PlayerContext); //puxa a lista vinda do contexto
  
  useEffect (() => { //monitorando o efeito apresentado no ref criado acima para alterar o áudio tocando
    if (!audioRef.current) {
      return;
    } if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]) //isPlaying altera, então executa o useEffect

  const episode = episodeList[currentEpisodeIndex]; //executa o episódio de index zero da lista


  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Playing now"/>
        <strong>Playing Now</strong>
      </header>

      { episode ? ( //verificando se tem algum epísódio tocando para então alterar o layout do Player
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Select a Podcast to listen</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''}> {/*se não houver episódio tocando, o estilo será EMPTY*/}
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}> {/*se não houver episódio tocando, o estilo será EMPTY*/}
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && ( //só vai executar áudio se episode for true (&&)
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingStatus(true)}
            onPause={() => setPlayingStatus(false)}
          />
        )} 

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Shuffle"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Play Previous"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying
              ? <img src="/pause.svg" alt="Pause"/>
              : <img src="/play.svg" alt="Play"/>
            }
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Play Next"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repeat"/>
          </button>
        </div>
      </footer>
    </div>
  );
}