import Head from 'next/head'
import styles from './styles.module.scss'
import { AiOutlineCalendar } from "react-icons/ai";
import { BiPencil, BiTrashAlt, BiTimeFive } from "react-icons/bi";
import SupportButton from '../../components/suporteButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React, { FormEvent } from 'react';
import { db } from '../../Models/firebaseConnection'
import { addDoc, collection, getDocs, orderBy, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Router from 'next/router'
import { ITask } from '../../interfaces/task';
import { IProps } from '../../interfaces/user';


const Board = (props: IProps) => {

  const [input, setInput] = React.useState('');
  const [tasklist, setTaskList] = React.useState<ITask[]>(JSON.parse(props.data))
  const [isTaskEdit, setIsTaskEdit] = React.useState(false)
  const [taskOnEdit, setTaskOnEdit] = React.useState<ITask | null>(null)
  const userDB = JSON.parse(props.getUserDBJSON)

  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault()
    if (input === "") {
      alert('preencha alguma tarefa')
      return;
    }

    if (taskOnEdit) {
      const taskRef = doc(db, "tasks", taskOnEdit.id);
      await updateDoc(taskRef, {
        task: input
      });
      const indexTaskEdit = tasklist.findIndex((item) => item.id === taskOnEdit.id)
      const tasks = tasklist
      tasks[indexTaskEdit].task = input
      setInput('')
      setTaskList(tasks)
      setIsTaskEdit(false)
      setTaskOnEdit(null)
      return;
    }

    try {
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

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    const updatetasks = tasklist.filter((item) => item.id !== id)
    setTaskList(updatetasks)
  }

  const handleEditTask = async (task: ITask) => {
    setInput(task.task)
    setTaskOnEdit(task)
    setIsTaskEdit(true)
  }

  const handleCancelEdit = () => {
    setInput('');
    setIsTaskEdit(false)
  }

  const handleRedirectTask = (task: ITask) => {
    console.log(task)
    Router.push(`/board/${task.id}`)
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.tasksContainer}>
          {isTaskEdit &&
            <h2 className={styles.titleEdited}>Tarefa em edição
              <button
                className={styles.buttonEdit}
                onClick={handleCancelEdit}
              >
                X
              </button>
            </h2>}
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
              <p onClick={() => handleRedirectTask(item)}>{item.task}</p>
              <div className={styles.tasks}>
                <div>
                  <AiOutlineCalendar />
                  <p>{item.createdFormated}</p>
                </div>
                <div onClick={() => handleEditTask(item)} className={styles.button}>
                  <BiPencil />
                  <p>Editar</p>
                </div>
                <div onClick={() => handleDelete(item.id)} className={styles.button}>
                  <BiTrashAlt color='#FF3636' />
                  <p>Excluir</p>
                </div>
              </div>
            </div>)}
        </div>
        {userDB[0].donate && <div className={styles.acknowledgmentContainer}>
          <h2>Obrigado por apoiar esse projeto</h2>
          <div>
            <BiTimeFive />
            <p>Última doação foi a {formatDistance(new Date(userDB[0].lastDonate), new Date(), { locale: ptBR })} </p>
          </div>
        </div>}
      </main>
      <SupportButton />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

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
    return tasks
  }

  const data = await fetchPost()

  const user = {
    nome: session?.user?.name,
    id: session?.expires,
    email: session?.user?.email,
  }

  let getUserDB: any

  const q = query(collection(db, "users"), where("image", "==", session.user?.image));
  const userSnap = await getDocs(q)
    .then((querySnapshot) => {
      const user = (querySnapshot.docs
        .map((doc) => (
          {
            ...doc.data(),
            lastDonate: format(doc.data().lastDonate.toDate(), 'dd MMMM yyyy')
          }
        )));
      getUserDB = user
    })
  const getUserDBJSON = JSON.stringify(getUserDB)

  return {
    props: { user, data, getUserDBJSON }
  }
}

export default Board


