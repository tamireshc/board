import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { IUserProp } from "../../interfaces/user"
import styles from './styles.module.scss'


const donate = ({ user }: IUserProp) => {
  return (
    <>
      <Head>
        <title>Ajude a plataforma boar a ficar online!S</title>
      </Head>

      <section className={styles.container}>
        <img src='/images/rocket.svg' className={styles.imgRoquet} />
        <div className={styles.containerSupporter}>
          <img src={user.image} />
          <p>Parabéns você é um apoiador!</p>
        </div>
        <h1>Seja um apoiador desse projeto 🏆</h1>
        <p>Contribua com apenas <span>R$1,00</span></p>
        <p>Apareça na nossa home tenha funcionalidades exclusivas.</p>

        <button>Paypal</button>

        <p>Power by Paypal</p>
      </section>
    </>
  )
}

export default donate

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const user = {
    name: session?.user?.name,
    email: session?.user?.email,
    image: session?.user?.image,
  }

  return {
    props: {
      user
    }
  }
}