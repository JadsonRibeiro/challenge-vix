import { Button } from "../Button";
import { signIn, signOut, useSession } from "next-auth/client";
import { AiOutlineLogout } from "react-icons/ai"

import styles from "./header.module.scss";

export function Header() {
  const [session, loading] = useSession();

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <h1>Controle de Registros</h1>
        {session ? (
          <div className={styles.userInfo}>
            <strong>{session.user?.name}</strong>
            <span>
              Sair 
              <AiOutlineLogout 
                onClick={() => signOut()}
              />
            </span>
          </div>
        ) : (
          <Button
            onClick={() => signIn('github')}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>
        )}
      </div>
    </header>
  )
}