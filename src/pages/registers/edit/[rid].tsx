import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import { getSession } from "next-auth/client";

import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { StatusSelect } from "../../../components/Select";

import { api } from "../../../services/api";

import { Register } from "../../../types";

import styles from "./edit-register.module.scss"; 

interface EditRegisterProps {
  register: Register,
  user: User
}

export default function EditRegister({ register, user }: EditRegisterProps) {
  const router = useRouter();

  const [name, setName] = useState(register.name);
  const [description, setDescription] = useState(register.description);
  const [status, setStatus] = useState(register.status);
  const [date, setDate] = useState(register.date);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(!name || !description || !date || !status) {
      return alert('Preencha todos os campos.');
    }

    try {
      await api.put(`/registers/${user.email}/${register._id}`, {
        name, description, date, status
      });
      alert("Registro atualizado com sucesso!");
      router.push("/registers");
    } catch(error) {
      console.log("Erro ao Editar novo registro", error);
      alert("Erro ao Editar registro!")
    }
  }

  return (
    <div className={styles.container}>
      <h1>Editar Registro</h1>
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
          Editar
        </Button>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
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
  const { rid } = query;

  const response = await api.get(`/registers/${user.email}/${rid}`);

  if(!response.data) {
    return {
      redirect: {
        destination: '/registers',
        permanent: false
      }
    }
  }

  return {
    props: {
      register: response.data,
      user
    }
  }
}