/** получение названия продукции по арткоду*/
export const pushNewProduct = async (action) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(action)
    }
    try {
        let result = await fetch(process.env.REACT_APP_SAGA_API+'forMainTable', options)
            .then(response => response.json());
        return new Promise(resolve => resolve(result))
    } catch (error) {
        console.log('error', error)
    }
}

/** удаление записей с временной таблицы по ID*/
export const deleteFromCheckTable = async (action) => {
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(action)
    }
    try {
        let result = await fetch(process.env.REACT_APP_SAGA_API+`forCheck/${action.id}`, options)
            .then(response => response.json());
        return new Promise(resolve => resolve(result))
    } catch (error) {
        console.log('error', error)
    }
}
