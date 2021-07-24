import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { AuthButton } from "../components/AuthButton";

import styles from "./home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Organize sua vida</h1>
      <h2>Faça um controle das suas atividades</h2>
      <AuthButton />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  console.log(session)

  if(session) {
    return {
      redirect: {
        destination: '/registers',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
