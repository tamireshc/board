import { GetServerSideProps } from "next"
import Head from "next/head"
import styles from '../styles/styles.module.scss'
import { db } from '../Models/firebaseConnection'
import { collection, getDocs, query } from 'firebase/firestore';
import { format } from 'date-fns'
import React from "react";

interface IHomeProps {
  data: string
}

interface IUser {
  donate: string;
  image: string;
  lastDonate: string,
}

export default function Home({ data }: IHomeProps) {
  const donateArray = JSON.parse(data)

  const [donaters, setDonatares] = React.useState<IUser[]>(donateArray)

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
            {donaters?.map((item) =>
              <img src={item.image} alt='imagem do apoiador' key={item.image} />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async () => {
  const fetchPost = async () => {
    let users
    await getDocs(query(collection(db, "users")))
      .then((querySnapshot) => {
        const donaters = JSON.stringify(querySnapshot.docs
          .map((doc) => (
            {
              ...doc.data(),
              lastDonate: format(doc.data().lastDonate.toDate(), 'dd MMMM yyyy')
            }
          )));

        users = donaters
      })
    return users
  }
  const data = await fetchPost()

  return {
    props: {
      data
    },
    revalidate: 60 * 60 //1h
  }
}