import styles from "./SummaryDescription.module.css";

function SummaryDescription({ project }) {
    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.description}>
                    <div className={styles.title}>Latest Summary</div>
                    <div className={styles["description-body"]}>
                        Lorem ipsum dolor sit amet. Hic facere excepturi qui nisi aperiam At officiis sunt sed labore tenetur At molestiae ipsam qui odit odio. Ut voluptatibus placeat quo voluptas amet ut consectetur facilis aut necessitatibus corporis aut laboriosam accusamus et iure amet et delectus magni.
                        Id rerum molestias qui dolore earum vel porro iure. Ad minima maxime vel deserunt quasi ut voluptatem autem qui sunt maiores sed itaque enim et modi optio ut consectetur eaque.
                        Qui quasi consequatur sed reprehenderit quia sit suscipit officiis quo provident deleniti ea corporis nostrum et dolorum voluptatem et assumenda aliquam? Sit sunt dolorum id commodi iste aut ducimus odio ut iste asperiores id nostrum ipsam est tempora consequuntur qui voluptatem eveniet?
                    </div>
                </div>
            </div>

            { project.status === "Completed\r" && <div className={styles.report}>Report: <a href="#">2022-TLEF-Final-Report-Elmo-WEB.pdf</a></div>}

        </div>
    );
}

export default SummaryDescription;