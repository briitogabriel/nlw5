import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = { //buscando somente as informações necessárias para o Player lateral (não necessário buscar tudo)
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = { //integração de Typescript para conter a lista de episódios do Player
  episodeList: Episode[];
  currentEpisodeIndex: number; //qual a posição no Array EpisodeList que está localizado o episódio tocando
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingStatus: (status: boolean) => void;
  clearPlayerState: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData)
//exportando um objeto vazio "as Player...", o typescript entende que a informação compartilhada terá o 
//formato conforme já tipado acima, ou seja, vai compartilhar episodeList e currentEpisodeIndex dentro do contexto

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) { //função que altera os estados do componente do Player, compartilhada via contexto
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }
  function toggleLoop() {
    setIsLooping(!isLooping)
  }
  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingStatus(status: boolean) {
    setIsPlaying(status);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex+1) < episodeList.length;

  function playNext() {
    if (isShuffling) { //shuffle usa Math.random * número máximo de índices -> envolver operação em Math.floor para arrendondar
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex+1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex-1)
    }
  }

  return (
    <PlayerContext.Provider
    value={{
      episodeList, 
      currentEpisodeIndex,
      play,
      playList,
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
    }}>
      {children}
    </PlayerContext.Provider>
  )}

export const usePLayer = () => { //com isso, para que as páginas acessem o componente do PLayer não será necessário importar useContext e PlayerContext
  return useContext(PlayerContext);
}