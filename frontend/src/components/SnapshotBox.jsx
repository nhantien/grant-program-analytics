import styles from "./SnapshotBox.module.css";

function SnapshotBox({ chart, type, title }) {

    const bgColor = type === 0 ? "#FFF" : "#DFF2FF";
    const flexDir = type === 0 ? "row" : "row-reverse";
    const justifyContent = type === 0 ? "flex-start" : "flex-end";

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