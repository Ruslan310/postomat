import {
    FETCH_ART,
    FETCH_ART_RESIVED,
    SET_FILTER,
    RESET_FILTER,
    SET_MODAL_MESSAGE,
    LOG_IN_FAILED,
    FETCH_NAME,
    FETCH_NAME_RESIVED,
    SET_SELECTED_NAME,
    SET_SELECTED_ART,
    FETCH_PRODUCT,
    FETCH_PRODUCT_RESIVED,
    CLOSE_MODAL_PAGE,
    OPEN_MODAL_PAGE,
    CLEAR_CHECKED_PRODUCT,
    CLEAR_ALL_CHECKED_PRODUCT,
    SET_FILTER_ID,
    DELETE_COLL_CHECK_TABLE
} from "./action";
let message
const initialState = {
    newArts: null,
    NewNames: null,
    NewProduct: [],
    mainProduct: null,
    modalMessage: null,
    loading: null,
    error: null,
    selectName: null,
    selectArt: null,
    modalPage: false
}

export const checkReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_COLL_CHECK_TABLE:
            let checkArray = []
            if(action.value.length){
                checkArray = state.NewProduct.filter(item => item.id !== action.value[0].id)
                return {...state, NewProduct: checkArray}
            }
            return {...state, modalMessage: 'все плохо...'}
        case CLEAR_CHECKED_PRODUCT:
            let checkListName = state.NewNames.slice()
            for (let i = 0; i < checkListName.length; i++) {
                checkListName[i].isSelectedName = false
            }
            let checkListNameArt = state.newArts.slice()
            for(let i=0; i < checkListNameArt.length; i++){
                checkListNameArt[i].isSelectedArt = false
            }
            return {...state, selectArt: null,
                selectName: null, NewNames: checkListName,newArts: checkListNameArt}
        case CLEAR_ALL_CHECKED_PRODUCT:
                let checkNewListName = state.NewNames.slice()
            for (let i = 0; i < checkNewListName.length; i++) {
                checkNewListName[i].isSelectedName = false
            }
            let checkNewListNameArt = state.newArts.slice()
            for(let i=0; i < checkNewListNameArt.length; i++){
                checkNewListNameArt[i].isSelectedArt = false
            }
            return {...state, NewProduct: [], selectArt: null,
                selectName: null, NewNames: checkNewListName,newArts: checkNewListNameArt}
        case SET_MODAL_MESSAGE:
            return {...state, modalMessage: action.message}
        case FETCH_ART:
            return {...state, loading: true}
        case FETCH_ART_RESIVED:
            if(action.data.length === 0){
                message = 'Таких записей нет в базе'
            } else {message = ''}
            return {...state, newArts: action.data, loading: false, modalMessage: message}
        case FETCH_NAME:
            return {...state, loading: true}
        case FETCH_NAME_RESIVED:
            if(action.data.length < 1){
                message = 'Нет данных в таблице'
            } else {
                message = ''
            }
            return {...state, NewNames: action.data, loading: false,modalMessage: message}
        case FETCH_PRODUCT:
            return {...state}
        case FETCH_PRODUCT_RESIVED:
            if(action.data.length < 1){
                message = 'Нет данных в таблице'
            } else {
                message = ''
            }
            return {...state, NewProduct: [...state.NewProduct, action.data]}
        case CLOSE_MODAL_PAGE:
            return {...state, modalPage: false, modalMessage: message}
        case OPEN_MODAL_PAGE:
            return {...state, modalPage: true}
        case SET_SELECTED_NAME: {
            let list = state.NewNames.slice()
            for (let i = 0; i < list.length; i++) {
                list[i].isSelectedName = false
            }
            list[action.index].isSelectedName = true
            return {...state, NewNames: list, selectName:action.post}
        }
        case SET_SELECTED_ART:
            let list = state.newArts.slice()
            for(let i=0; i < list.length; i++){
                list[i].isSelectedArt = false
            }
            list[action.index].isSelectedArt = true
            return {...state, newArts: list, selectArt:action.post}
        case SET_FILTER:
            let stText = action.value
            let stOnline = state.NewNames.slice()
            for (let i = 0; i < stOnline.length; i++) {
                let result = false
                stOnline[i].isFilter = false
                if (stOnline[i].nameSKU.toLowerCase().includes(stText.toLowerCase())) {
                    result = true
                }
                if (result) {
                    stOnline[i].isFilter = true
                }
            }
            return {...state, NewNames: stOnline}
        case SET_FILTER_ID:
            let stTextId = action.value
            let stOnlineId = state.NewNames.slice()
            for (let y = 0; y < stOnlineId.length; y++) {
                let result = false
                stOnlineId[y].isFilterProduct = false
                if (stOnlineId[y].partner_ID.toString().includes(stTextId)) {
                    result = true
                }
                if (result) {
                    stOnlineId[y].isFilterProduct = true
                }
            }
            return {...state, NewNames: stOnlineId}
        case RESET_FILTER:
            let filterList = state.NewNames.slice()
            for (let i = 0; i < filterList.length; i++) {
                filterList[i].isFilter = true
                filterList[i].isFilterProduct = true
            }
            return {...state, NewNames: filterList}
        case LOG_IN_FAILED:
            return {...state, error: action.data,
                modalMessage: 'Ошибка передачи данных', loading: false}
        default:
            return state
    }
}
