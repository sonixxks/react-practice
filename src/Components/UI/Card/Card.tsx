import styles from './Card.module.scss';

interface CardProps {
    title?: string;
    description?: string;
    image?: string;
    alt?: string;
}

export default function Card({ title, description, image, alt = '' }: CardProps) {
    if (image) {
        return (
            <div className={`${styles.card} ${styles.cardImage}`}>
                <img src={image} className={styles.image} alt={alt}/>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    )
}