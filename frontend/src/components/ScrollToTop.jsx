import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {

    const { pathname } = useLocation();

    useEffect(() => {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });

        // Respaldo para navegadores antiguos
        window.scrollTo(0, 0);

    }, [pathname]);

    return null;
};

export default ScrollToTop;