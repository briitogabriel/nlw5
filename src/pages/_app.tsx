import '../styles/global.scss'

import styles from '../styles/app.module.scss';

import { Header } from '../components/Header';
import { PLayer } from '../components/Player';

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>

      <PLayer />
    
    </div>
  );
}

export default MyApp
