import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { HiOutlineDotsCircleHorizontal, HiOutlineExclamationCircle, HiOutlineCheckCircle } from "react-icons/hi"

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import { api } from "../../services/api";

import { Register } from "../../types";

import styles from "./registers.module.scss";

interface RegistersPageProps {
  registers: Register[]
}

const StatusICon = {
  pending: <HiOutlineDotsCircleHorizontal color="orange" size={20}/>,
  canceled: <HiOutlineExclamationCircle color="red" size={20}/>,
  completed: <HiOutlineCheckCircle color="green" size={20}/>
}

export default function RegistersPage({ registers: loadedRegisters }: RegistersPageProps) {
  const [registers, setRegisters] = useState(loadedRegisters);
  const [orderDirection, setorderDirection] = useState('desc');

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

  function reorderRegisters() {
    const registersCopy = [...registers];

    const reorderedRegisters = registersCopy.sort((a, b) => {
      if(orderDirection === 'asc')
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      else
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
    setorderDirection(direction => direction === 'asc' ? 'desc' : 'asc');
    setRegisters(reorderedRegisters);
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
            <div className={styles.listHeader}>
              <span>Nome</span>
              <span className={styles.orderableItem}>
                {orderDirection === 'desc' 
                  ? <AiOutlineArrowDown onClick={reorderRegisters}/> 
                  : <AiOutlineArrowUp onClick={reorderRegisters}/> 
                }
                Data
              </span>
              <span>Status</span>
              <span>Ações</span>
            </div>
            {registers.map(register => (
              <div key={register.id} className={styles.listItem}>
                <span className={styles.name}>{register.name}</span>
                <span>{new Intl.DateTimeFormat('pt-BR').format(new Date(register.date))}</span>
                <span>{StatusICon[register.status]}</span>
                <span className={styles.actions}>
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
                </span>
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
  const response = await api.get("/registers", {
    params: {
      _sort: 'date',
      _order: 'desc'
    }
  });

  if(response.data)
    registers = response.data;
  
  return {
    props: {
      registers
    }
  }
}