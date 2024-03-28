// css style
import styles from "./SnapshotBox.module.css";

function SnapshotBox({ chart, type, title }) {

    const bgColor = type === 0 ? "#FFF" : "#e1f3f9";
    const flexDir = type === 0 ? "row-reverse" : "row-reverse";
    const justifyContent = type === 0 ? "flex-end" : "flex-end";

    return (
        <div className={styles.bg} style={{ backgroundColor: bgColor }}>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.container} style={{ flexDirection: flexDir, justifyContent: justifyContent }}>
                {chart}
            </div>
        </div>
    );
};

export default SnapshotBox;                                             