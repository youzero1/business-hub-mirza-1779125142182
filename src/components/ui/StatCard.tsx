import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
};

export default function StatCard({ label, value, icon, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={`${styles.iconWrap} ${styles[color]}`}>{icon}</div>
        {trend && (
          <span className={`${styles.trend} ${trend.value >= 0 ? styles.trendUp : styles.trendDown}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {trend && <div className={styles.trendLabel}>{trend.label}</div>}
    </div>
  );
}
