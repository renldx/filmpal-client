import { useEffect, useState } from "react";

const TestComp = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch("/api/genres");

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                console.log(json);
                setData(json);
            } catch (error) {
                console.error(error.message);
            }
        }

        getData();
    });

    if (data && data.length > 0) {
        return (
            <div id="test-comp">
                <button id="test-button">{data[0]}</button>
            </div>
        );
    }
};

export default TestComp;
