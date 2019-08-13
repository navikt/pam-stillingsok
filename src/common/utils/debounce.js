function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func(...args);
        }, delay);
    };
}

export default debounce;
