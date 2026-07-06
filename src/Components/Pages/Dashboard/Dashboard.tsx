import styles from './Dashboard.module.scss'
import Analytics from '../../Widgets/Analytics/Analytics'
import TransactionTable from '../../Widgets/TransactionTable/TransactionTable'
import TransactionForm from '../../Widgets/TransactionForm/TransactionForm'
import MonthSelector from '../../Widgets/MonthSelector/MonthSelector'


export default function Dashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <section className={styles.form}>
          <TransactionForm/>
        </section>
        <section className={styles.info}>
          <MonthSelector />
          <Analytics/>
          <TransactionTable/>
        </section>
      </div>
    </div>
  )
}