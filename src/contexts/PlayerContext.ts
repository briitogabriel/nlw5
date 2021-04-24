import { createContext } from 'react';

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
  play: (episode: Episode) => void;
  togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData)
//exportando um objeto vazio "as Player...", o typescript entende que a informação compartilhada terá o 
//formato conforme já tipado acima, ou seja, vai compartilhar episodeList e currentEpisodeIndex dentro do contexto