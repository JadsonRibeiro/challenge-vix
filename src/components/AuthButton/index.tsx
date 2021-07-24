import { useSession, signIn, signOut } from "next-auth/client";

import { Button } from "../Button";

export function AuthButton() {
  const [session, loading] = useSession();

  if(loading) return <Button>Carregando...</Button>

  if(!session) {
    return (
      <Button
        onClick={() => signIn('github')}
      >
        Login
      </Button>
    )
  }

  return (
    <Button
      onClick={() => signOut()}
    >
      Sair
    </Button>
  )
}