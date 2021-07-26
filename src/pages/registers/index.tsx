import { ChangeEvent, ReactNode, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getSession } from "next-auth/client";
import { User } from "next-auth";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineArrowDown, AiOutlineArrowUp, AiOutlinePlus } from "react-icons/ai"
import { HiOutlineDotsCircleHorizontal, HiOutlineExclamationCircle, HiOutlineCheckCircle } from "react-icons/hi"

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { StatusSelect } from "../../components/Select";

import { api } from "../../services/api";

import { Register } from "../../types";

import styles from "./registers.module.scss";

interface RegistersPageProps {
  registers: Register[],
  user: User
}

const StatusICon: {[status: string]: ReactNode} = {
  pending: <HiOutlineDotsCircleHorizontal color="orange" size={20}/>,
  canceled: <HiOutlineExclamationCircle color="red" size={20}/>,
  completed: <HiOutlineCheckCircle color="green" size={20}/>
}

export default function RegistersPage({ registers: loadedRegisters, user }: RegistersPageProps) {
  const [registers, setRegisters] = useState(loadedRegisters);
  const [orderDirection, setorderDirection] = useState('desc');

  async function handleDeteleRegister(registerID: number) {
    const deleteRegister = confirm('Tem certeza que deseja excluir esse registro?');

    if(!deleteRegister) return;

    try {
      await api.delete(`/registers/${user.email}/${registerID}`);

      setRegisters(oldRegisters => {
        return oldRegisters.filter(register => register._id !== registerID)
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

  function handleFilterRegisters(event: ChangeEvent<HTMLSelectElement>) {
    const selectedStatus = event.target.value;

    if(!selectedStatus)
      return setRegisters(loadedRegisters);
    
    const filteredRegisters = loadedRegisters.filter(register => register.status === selectedStatus);

    setRegisters(filteredRegisters);
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Registros</h1>
          <div className={styles.filter}>
            Filtrar {" "}
            <StatusSelect 
              onChange={handleFilterRegisters}
            />
          </div>
          <Button>
            <Link href="/registers/add"><a>
              <span>Novo Registro</span>
              <AiOutlinePlus />
            </a></Link>
          </Button>
        </div>

        {registers.length > 0 ? (
          <div className={styles.list}>
            <div className={`${styles.listItem} ${styles.listHeader}`}>
              <span className={styles.name}>Nome</span>
              <span className={`${styles.date} ${styles.orderableItem}`}>
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
              <div key={register._id} className={styles.listItem}>
                <span className={styles.name}>{register.name}</span>
                <span className={styles.date}>
                  {new Intl.DateTimeFormat('pt-BR').format(new Date(register.date))}
                </span>
                <span>{StatusICon[register.status]}</span>
                <span className={styles.actions}>
                  <button>
                    <Link href={`/registers/edit/${register._id}`}><a>
                      <AiOutlineEdit size={20} />
                    </a></Link>
                  </button>
                  <button
                    onClick={() => handleDeteleRegister(register._id)}
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

export const getServerSideProps: GetServerSideProps<RegistersPageProps> = async ({ req }) => {
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

  let registers: Register[] = [];
  const response = await api.get(`/registers/${user?.email}`, {
    params: {
      _sort: 'date',
      _order: 'desc'
    }
  });

  if(response.data)
    registers = response.data;
  
  return {
    props: {
      registers,
      user
    }
  }
}