import styles from './Input.module.css';

type InputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  disabled = false,
  name,
}: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        name={name}
        className={`${styles.input} ${error ? styles.hasError : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
