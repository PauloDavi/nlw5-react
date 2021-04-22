import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import ReactTooltip from 'react-tooltip'

import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale: ptBR
  })

  return(
    <header className={styles.headerContainer}>
      <ReactTooltip effect="solid" backgroundColor="rgba(0, 0, 0, 0.7)" place="bottom"/>

      <Link href="/">
        <button data-tip="Início" type="button">
          <img src="/logo.svg" alt="Podcastr"/>
        </button>
      </Link>

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}
