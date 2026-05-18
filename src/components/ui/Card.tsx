import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
};

export default function Card({ children, className = '', onClick, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ''} ${styles[`pad_${padding}`]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
