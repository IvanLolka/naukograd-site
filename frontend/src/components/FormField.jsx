import styles from '../css/FormField.module.css';

function FormField({ 
    label, 
    type = "text", 
    name, 
    id, 
    value, 
    onChange, 
    placeholder,
    ...rest // Чтобы можно было передать любые другие атрибуты
}) {
    // Если не передан id, генерируем уникальный из name
    const inputId = id || name;
    
    return (
        <div className={styles.FormField}>
            {/* ✅ Используем label вместо h3 */}
            <label 
                className={styles.Title} 
                htmlFor={inputId}
            >
                {label}
            </label>
            
            {/* ✅ Пробрасываем все нужные атрибуты в input */}
            <input
                className={styles.Input}
                type={type}
                name={name}
                id={inputId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...rest} // Остальные пропсы (required, min, max и т.д.)
            />
        </div>
    );
}

export default FormField;