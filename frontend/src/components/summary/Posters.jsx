import styles from "./Posters.module.css";

function Posters({ project }) {
    
    let slideIndex = 1;

    const plusDivs = (n) => {
        showDivs(slideIndex += n);
    };

    const showDivs = (n) => {
        let i;
        let x = document.getElementsByClassName(styles.slideElement);
        if (n > x.length) slideIndex = 1;
        if (n < 1) slideIndex = x.length;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "flex";
    };

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                TLEF Showcase
            </div>

            <div className={styles.container}>
                <button className={styles.btn} onClick={() => plusDivs(-1)}>&lt;</button>

                <div className={styles.slideElement}>
                    <div>Year 1</div>
                    <div className={styles.poster}></div>
                </div>

                <div className={styles.slideElement} style={{ display: "none"}}>
                    <div>Year 2</div>
                    <div className={styles.poster}></div>
                </div>

                <div className={styles.slideElement} style={{ display: "none"}}>
                    <div>Year 3</div>
                    <div className={styles.poster}></div>
                </div>

                <button className={styles.btn} onClick={() => {plusDivs(1)}}>&gt;</button>
            </div>
        </div>
    );
}

export default Posters;