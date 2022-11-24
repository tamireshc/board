import Link from 'next/link'
import styles from './styles.module.scss'

const SupportButton = () => {
  return (
    <div className={styles.donateContainer}>
      <Link href='donate'>
        <button>Apoiar</button>
      </Link>
    </div>

  )
}

export default SupportButton