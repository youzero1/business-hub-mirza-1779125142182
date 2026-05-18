import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'primary';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
};

export default function Badge({ children, variant = 'default', dot = false }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
