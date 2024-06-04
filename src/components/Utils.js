export const today = new Date();
  export const todayWithoutTimezone = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString().split("T")[0];

  const ordenarPropriedadesObjeto = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(item => ordenarPropriedadesObjeto(item));
    } else if (obj !== null && typeof obj === 'object') {
        const sortedObj = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sortedObj[key] = ordenarPropriedadesObjeto(obj[key]);
        }
        return sortedObj;
    } else {
        return obj;
    }
};

export const ordenarArrayPropriedadesObjeto = (arr) => {
    return arr.map(obj => ordenarPropriedadesObjeto(obj));
};

export const formatarDataString = (date) => {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  const segundos = String(date.getSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
};

const converterStringParaDate = (dateString) => {
  const [parteData, parteTempo] = dateString.split(' ');
  const [dia, mes, ano] = parteData.split('/').map(Number);
  const [horas, minutos, segundos] = parteTempo.split(':').map(Number);
  return new Date(ano, mes - 1, dia, horas, minutos, segundos);
};

export const ordenarPorDataString = (arr, dateKey) => {
  return arr.sort((a, b) => converterStringParaDate(b[dateKey]) - converterStringParaDate(a[dateKey]));
};