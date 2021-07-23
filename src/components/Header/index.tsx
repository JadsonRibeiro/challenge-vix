import { Button } from "../Button";

import styles from "./styles.module.scss";

export function Header() {
  const user = {
    name: 'Jadson Ribeiro',
    email: 'jadson@email.com'
  }
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <h1>Controle de Registros</h1>
        {user ? (
          <div className={styles.userInfo}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        ) : (
          <Button>Entrar</Button>
        )}
      </div>
    </header>
  )
}