export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    try {
        return value ? JSON.parse(value) : [];
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return [];
    }
};

export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};
