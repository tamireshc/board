import styles from './styles.module.scss'
import Link from 'next/link'
import SignInButton from '../SignInButton'

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'> <img src='/images/logo.svg' alt='logo do meu board' />
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