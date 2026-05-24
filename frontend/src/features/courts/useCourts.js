import { useEffect, useState } from "react";
import { getCourts } from "./courtService";

export default function useCourts() {
    const [courts, setCourts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [category, setCategory] = useState("ALL");

    useEffect(() => {
        getCourts().then(res => {
            setCourts(res.data);
            setFiltered(res.data);
        });
    }, []);

    useEffect(() => {
        if (category === "ALL") {
            setFiltered(courts);
        } else {
            setFiltered(
                courts.filter(c => c.category.name === category)
            );
        }
    }, [category, courts]);

    return {
        courts: filtered,
        setCategory,
        category
    };
}