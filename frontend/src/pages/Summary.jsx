import { useParams } from "react-router-dom";

function Summary () {
    const { id } = useParams();
    return (
        <div>
            <h1>Hello {id}!!</h1>
        </div>
    );
};

export default Summary;