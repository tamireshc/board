/* eslint-disable @next/next/no-img-element */
import styles from './styles.module.scss'
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';


interface ISession {
  email: string;
  image: string;
  name: string;
}

const SignInButton = () => {
  const { data: session } = useSession()
  console.log(session?.user?.name)
  // const session = true

  return (

    session ? (
      <button
        type='button'
        className={styles.signInButton}

      >

        {/* <Image src={session?.user?.image as any} alt='imagem' width='30' height='30' /> */}

        {session?.user?.name}
        <FiX color='#c83107' onClick={() => { signOut() }} />
      </button>
    ) : (
      <button
        type='button'
        className={styles.signInButton}
        onClick={() => { signIn('github') }}>
        <FaGithub color="#FFB800" />
        Entrar com GitHub
      </button>
    )

  )
}

export default SignInButton
