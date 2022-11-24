import { GetServerSideProps } from "next"
import Head from "next/head"
import styles from '../styles/styles.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - organizando tarefas</title>
      </Head>
      <section>
        <div className={styles.mainContainer}>
          <img src="/images/board-user.svg" alt='imagem do board user' />
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se... </h1>
          <h2><span>100% Gratuita </span>e online</h2>
        </div>
        <div className={styles.supporterContainer}>
          <h3>Apoiadores:</h3>
          <div className={styles.supporterImages}>
            <img src='https://sujeitoprogramador.com/steve.png' />
            <img src='https://sujeitoprogramador.com/steve.png' />
            <img src='https://sujeitoprogramador.com/steve.png' />
          </div>
        </div>

      </section>

    </>
  )
}

// export const getStaticProps:GetServerSideProps = async ()=>{
//   return{
//     props:{
      
//     },
//     revaldate:60*60 //1h
//   }
// }