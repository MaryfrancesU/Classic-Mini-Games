/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import styles from './index.module.scss';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title> Mini Games </title>
        <meta name="description" content="simple mini games web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.headerText}> 
         <h1> Choose a mini game to play! </h1>
      </div>

      <div className={styles.gameTiles}> 
         <Link href="/hangman" className={styles.gameTile}> 
            <img
               alt="hang man"
               className={styles.image} 
               src="https://uipath.com/cdn-cgi/image/format=auto/https://marketplace-cdn.uipath.com/images/user_images/3773fd1a-feed-45c5-a222-51f7cd3e091b.png" 
            />
            <div className={styles.overlay}>
               HANG MAN 
            </div>
         </Link>

         <Link href="/tictactoe" className={styles.gameTile}> 
            <img
               alt="hang man"
               className={styles.image} 
               src="https://media.istockphoto.com/id/1365567894/vector/hand-drawn-vector-tic-tac-toe-game-noughts-and-crosses-doodle-sketch.jpg?s=170667a&w=0&k=20&c=z3Ei_EiNZqTrLCdTg9yDznO6_3r4wiIX9U3fdVJQVNc="
            />
            <div className={styles.overlay}>
               TIC TAC TOE
            </div>
         </Link>

         <Link href="/unscrambler" className={styles.gameTile}> 
            <img
               alt="hang man"
               className={styles.image} 
               src="https://pixy.org/src/80/thumbs350/808673.jpg"
            />
            <div className={styles.overlay}>
               SCRAMBLER 
            </div>
         </Link>

      </div>

    </>
  )
}
