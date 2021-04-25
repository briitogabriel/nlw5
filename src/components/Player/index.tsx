import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePLayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); //utilizando ref para alternar status do áudio
  const [progress, setProgress] = useState(0); //monitorando o slider do Player

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingStatus,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePLayer(); //puxa a lista vinda do contexto
  
  useEffect (() => { //monitorando o efeito apresentado no ref criado acima para alterar o áudio tocando
    if (!audioRef.current) {
      return;
    } if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]) //isPlaying altera, então executa o useEffect

  function setupProgressListener() {
    audioRef.current.currentTime = 0; //sempre que tocar outro episódio, o estado tem que voltar para 00:00
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }
  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

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
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}> {/*se não houver episódio tocando, o estilo será EMPTY*/}
            { episode ? (
              <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && ( //só vai executar áudio se episode for true (&&)
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingStatus(true)}
            onPause={() => setPlayingStatus(false)}
            onLoadedMetadata={() => setupProgressListener()}
          />
        )} 

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle}
            className={isShuffling
            ? styles.isActive
            : ''
          }>
            <img src="/shuffle.svg" alt="Shuffle"/>
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Play Previous"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying
              ? <img src="/pause.svg" alt="Pause"/>
              : <img src="/play.svg" alt="Play"/>
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Play Next"/>
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop}
            className={isLooping
            ? styles.isActive
            : ''
          }>
            <img src="/repeat.svg" alt="Repeat"/>
          </button>
        </div>
      </footer>
    </div>
  );
}