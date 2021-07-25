import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";

import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { StatusSelect } from "../../../components/Select";
import { User } from "next-auth";

import { api } from "../../../services/api";

import styles from "./add-register.module.scss";

interface AddRegisterProps {
  user: User
}

export default function AddRegister({ user }: AddRegisterProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(!name || !description || !date || !status) {
      return alert('Preencha todos os campos.');
    }

    try {
      await api.post(`/registers/${user.email}`, {
        name, description, date, status
      });
      alert("Registro adicionar com sucesso!");
      router.push("/registers");
    } catch(error) {
      console.log("Erro ao adicionar novo registro", error);
      alert("Erro ao adicionar registro!")
    }
  }

  return (
    <div className={styles.container}>
      <h1>Adicionar Registro</h1>
      <form onSubmit={handleSubmit}>
        <Input 
          name="Nome" 
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Textarea 
          name="Descrição" 
          rows={5}
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
        <StatusSelect 
          value={status}
          onChange={event => setStatus(event.target.value)}
        />
        <Input 
          name="Data" 
          type="date" 
          onChange={event => setDate(event.target.value)}
          value={date}
        />
        <Button>
          Adicionar
        </Button>
      </form>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if(!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const { user } = session;

  return {
    props: {
      user
    }
  }
}