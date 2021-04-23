import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import Toggle from 'react-toggle'
import ReactTooltip from 'react-tooltip'

import { useTheme } from '../../contexts/ThemeContext'
import styles from './styles.module.scss'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <ReactTooltip effect="solid" backgroundColor="rgba(0, 0, 0, 0.7)" place="bottom" />

      <Link href="/">
        <button data-tip="Início" type="button">
          <img src={theme === 'dark' ? '/dark-logo.svg' : '/logo.svg'} alt="Podcastr" />
        </button>
      </Link>

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>

      <Toggle
        className={styles.customToggle}
        checked={theme === 'light'}
        icons={{
          checked: <img src="/sun.svg" alt="Tema claro" />,
          unchecked: <img src="/moon.svg" alt="Tema escuro" />,
        }}
        onChange={toggleTheme}
      />
    </header>
  )
}
