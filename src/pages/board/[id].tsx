import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../Models/firebaseConnection';
import { format } from 'date-fns'
import styles from './styles.module.scss'
import { BiCalendar } from "react-icons/bi";

interface ITask {
  id: string;
  created: Date
  createdFormated: string;
  task: string;
  email: string;
  nome: string;
}

const Task = (props: any) => {
  const task: ITask = JSON.parse(props.data)

  return (
    <section className={styles.container}>
      <div className={styles.tasksContainer}>
        <div className={styles.dataContainer}>
          <BiCalendar color='#FFBA00' />
          <p>Tarefa Criada<span>{task.createdFormated}</span></p>
        </div>
        <p >{task.task}</p>
      </div>
    </section>
  )
}

export default Task

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const { id } = params as any
  // console.log('paramns', params)
  // console.log(session)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const docRef = doc(db, "tasks", id);
  const docSnap = await getDoc(docRef)

  const newdata = {
    ...docSnap.data(),
    id: docSnap.id,
    createdFormated: format(docSnap?.data()?.created.toDate(), 'dd MMMM yyyy')
  }

  const dataJson = JSON.stringify(newdata)

  return {
    props: {
      data: dataJson
    }
  }
}