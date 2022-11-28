import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../Models/firebaseConnection';
import { format } from 'date-fns'
import styles from './styles.module.scss'
import { BiCalendar } from "react-icons/bi";
import { ITask } from '../../interfaces/task';


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


  if (!docSnap?.data()?.task) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      }
    }
  }

  const newdata = {
    ...docSnap.data(),
    id: docSnap.id,
    createdFormated: format(docSnap?.data()?.created.toDate(), 'dd MMMM yyyy')
  }

  const dataJson = JSON.stringify(newdata)

  let getUser: any

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
      getUser = user
    })


  if (getUser && !getUser[0].donate) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      }
    }
  }

  return {
    props: {
      data: dataJson
    }
  }
}