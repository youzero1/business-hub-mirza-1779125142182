import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string; positive?: boolean };
  color?: string;
};

export default function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <div className={styles.icon} style={color ? { background: color + '22', color } : undefined}>
            {icon}
          </div>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${trend.positive ? styles.positive : styles.negative}`}>
          <span>{trend.positive ? '+' : ''}{trend.value}%</span>
          <span className={styles.trendLabel}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
