import { useEffect } from "react"

type SnackbarType = "success" | "error";

export const AXIOS_TIME = 2000;

const useSnackbar = (message: string | undefined, type: SnackbarType) => {

    useEffect(() => {
        if (message) {
            const backgroundColor = type === "success" ? "forestgreen" : "red";

            const snackbar = document.createElement('div');
            snackbar.style.position = "absolute";
            snackbar.style.bottom = '20px';
            snackbar.style.right = '20px';
            snackbar.style.padding = '8px 12px 8px 12px';
            snackbar.style.backgroundColor = backgroundColor;
            snackbar.style.color = "white";
            snackbar.style.borderRadius = "5px";
            snackbar.style.zIndex = "9999";
            snackbar.textContent = message;

            const mainEl = document.body;
            mainEl?.appendChild(snackbar);

            setTimeout(() => {
                mainEl?.removeChild(snackbar);
            }, AXIOS_TIME);
        }
    }, [message]);

    return;
}

export default useSnackbar;