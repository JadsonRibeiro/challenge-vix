import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import { api } from "../../services/api";

import { Register } from "../../types";

import styles from "./home.module.scss";

interface RegistersPageProps {
  registers: Register[]
}

export default function RegistersPage({ registers: loadedRegisters }: RegistersPageProps) {
  const [registers, setRegisters] = useState(loadedRegisters);

  async function handleDeteleRegister(registerID: number) {
    const deleteRegister = confirm('Tem certeza que deseja excluir esse registro?');

    if(!deleteRegister) return;

    try {
      await api.delete(`/registers/${registerID}`);

      setRegisters(oldRegisters => {
        return oldRegisters.filter(register => register.id !== registerID)
      });

      alert('Registro excluído com sucesso!');
    } catch(error) {
      alert('Erro ao excluir registro.');
      console.log('Erro ao excluir registro', error);
    }
  }
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Registros</h1>
          <Button>
            <Link href="/registers/add">Novo Registro</Link>
          </Button>
        </div>

        {registers.length > 0 ? (
          <div className={styles.list}>
            {registers.map(register => (
              <div key={register.id} className={styles.item}>
                <span className={styles.name}>{register.name}</span>
                <span>{new Intl.DateTimeFormat('pt-BR').format(new Date(register.date))}</span>
                <div className={styles.actions}>
                  <button>
                    <Link href={`/registers/edit/${register.id}`}><a>
                      <AiOutlineEdit size={20} />
                    </a></Link>
                  </button>
                  <button
                    onClick={() => handleDeteleRegister(register.id)}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span>Nenhum registro encontrado</span>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<RegistersPageProps> = async () => {
  let registers: Register[] = [];
  const response = await api.get("/registers");

  if(response.data)
    registers = response.data;
  
  return {
    props: {
      registers
    }
  }
}