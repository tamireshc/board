import styles from './styles.module.scss'
import Link from 'next/link'
import SignInButton from '../SignInButton'
import Image from 'next/image'

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'>
          <Image src='/images/logo.svg' alt='logo do meu board' width={65} height={65} />
        </Link>
        <nav>
          <Link href='/'>Home</Link>
          <Link href='/board'>Meu Board</Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}

export default Header