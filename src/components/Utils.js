export const today = new Date();
  export const todayWithoutTimezone = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString().split("T")[0];

  const sortObjectProperties = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(item => sortObjectProperties(item));
    } else if (obj !== null && typeof obj === 'object') {
        const sortedObj = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sortedObj[key] = sortObjectProperties(obj[key]);
        }
        return sortedObj;
    } else {
        return obj;
    }
};

export const sortArrayObjectsProperties = (arr) => {
    return arr.map(obj => sortObjectProperties(obj));
};