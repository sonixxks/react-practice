import styles from './App.module.css'
import Analytics from './components/Analytics/Analytics'
import TransactionForm from './components/TransactionForm/TransactionForm'
import TransactionTable from './components/TransactionTable/TransactionTable'

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Финансовый трекер</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.form}>
          <TransactionForm/>
        </section>
        <section className={styles.info}>
          <Analytics/>
          <TransactionTable/>
        </section>
      </main>
    </div>
  )
}

export default App