import { useEffect } from "react";

const useScrollHandler = (id) => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hash = window.location.hash;

            if (hash === `#${id}`) {
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100); // wait for DOM
            }
        }
    }, [id]);
};

export default useScrollHandler;