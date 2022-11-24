import Head from 'next/head'
import styles from './styles.module.scss'
import { AiOutlineCalendar } from "react-icons/ai";
import { BiPencil, BiTrashAlt, BiTimeFive } from "react-icons/bi";
import SupportButton from '../../components/suporteButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React, { FormEvent } from 'react';
import { db } from '../../Models/firebaseConnection'
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { format } from 'date-fns'


interface IUser {
  nome: string;
  id: string;
  email: string,
}

interface IProps {
  user: IUser;
  data: string;
}
interface ITaskCreated {
  id: string;
  created: Date
  createdFormated: string;
  task: string;
  email: string;
  nome: string;

}
const Board = (props: IProps) => {

  const [input, setInput] = React.useState('');
  const [tasklist, setTaskList] = React.useState<ITaskCreated[]>(JSON.parse(props.data))

  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault()
    if (input === "") {
      alert('preencha alguma tarefa')
      return;
    }
    try {
      console.log('chegou', props.user.nome)
      await addDoc(collection(db, "tasks"), {
        created: new Date(),
        task: input,
        name: props.user.nome,
        email: props.user.email,

      }).then((doc) => {
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), 'dd MMMM yyyy'),
          task: input,
          email: props.user.email,
          nome: props.user.nome,
        }
        setInput('')
        setTaskList([...tasklist, data])

      });


    } catch (error) {
      console.error("Error adding document: ", error);
    }


  }
  console.log(tasklist)

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.tasksContainer}>
          <form
            className={styles.form}
            onSubmit={handleAddTask}
          >
            <input
              type='text'
              value={input}
              onChange={({ target }) => setInput(target.value)}
            />
            <button>+</button>
          </form>
          <h1>Você tem {tasklist.length} {tasklist.length === 1 ? 'tarefa' : 'tarefas'}</h1>

          {tasklist.map((item) =>
            <div key={item.id} className={styles.alltasks}>
              <p>{item.task}</p>
              <div className={styles.tasks}>
                <div>
                  <AiOutlineCalendar />
                  <p>{item.createdFormated}</p>
                </div>
                <div>
                  <BiPencil />
                  <p>Editar</p>
                </div>
                <div>
                  <BiTrashAlt color='#FF3636' />
                  <p>Excluir</p>
                </div>
              </div>
            </div>)}
        </div>
        <div className={styles.acknowledgmentContainer}>
          <h2>Obrigado por apoiar esse projeto</h2>
          <div>
            <BiTimeFive />
            <p>Última doação foi a 3 dias.</p>
          </div>
        </div>


      </main>
      <SupportButton />

    </>
  )

}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  // console.log(session)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  // const q = query(collection(db, "cities"), where("capital", "==", true));

  // const querySnapshot = await getDocs(q);

  const fetchPost = async () => {
    let tasks
    const q = query(collection(db, "tasks"), where("email", "==", session.user?.email), orderBy('created', 'desc'));

    await getDocs(q)
      .then((querySnapshot) => {
        const newData = JSON.stringify(querySnapshot.docs
          .map((doc) => (
            {
              ...doc.data(),
              id: doc.id,
              createdFormated: format(doc.data().created.toDate(), 'dd MMMM yyyy')
            }
          )));

        tasks = newData
      })
    // console.log(tasks)
    return tasks

  }
  const data = await fetchPost()

  const user = {
    nome: session?.user?.name,
    id: session?.expires,
    email: session?.user?.email,

  }

  return {
    props: { user, data }
  }
}

export default Board


