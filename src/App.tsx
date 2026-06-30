import styles from './App.module.css'
import Analytics from './components/Analytics/Analytics'
import Form from './components/Form/Form'
import List from './components/CardList/CardList'

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Финансовый трекер</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.form}>
          <Form/>
        </section>
        <section className={styles.info}>
          <Analytics />
          <List />
        </section>
      </main>
    </div>
  )
}

export default App