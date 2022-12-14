import styles from './styles.module.scss'
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';

const SignInButton = () => {
  const { data: session } = useSession()
  const srcImage = session?.user?.image as string

  return (
    session ? (
      <button
        type='button'
        className={styles.signInButton}
      >
        <Image src={srcImage} width='30' height='30' alt='imagem' />
        {session?.user?.name}
        <FiX color='#737380' onClick={() => { signOut() }} />
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
