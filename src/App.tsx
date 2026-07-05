import styles from './App.module.css'
import Analytics from './Components/Widgets/Analytics/Analytics'
import MonthSelector from './Components/Widgets/MonthSelector/MonthSelector'
import TransactionForm from './Components/Widgets/TransactionForm/TransactionForm'
import TransactionTable from './Components/Widgets/TransactionTable/TransactionTable'

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
          <MonthSelector />
          <Analytics/>
          <TransactionTable/>
        </section>
      </main>
    </div>
  )
}

export default App