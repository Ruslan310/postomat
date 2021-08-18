export const FETCH_ART = 'FETCH_ART'
export const FETCH_ART_RESIVED = 'FETCH_ART_RESIVED'
export const FETCH_NAME = 'FETCH_NAME'
export const FETCH_NAME_RESIVED = 'FETCH_NAME_RESIVED'
export const SET_FILTER = 'SET_FILTER'
export const SET_FILTER_ID = 'SET_FILTER_ID'
export const RESET_FILTER = 'RESET_FILTER'
export const SET_MODAL_MESSAGE = 'SET_MODAL_MESSAGE'
export const LOG_IN_FAILED = 'LOG_IN_FAILED'
export const SET_SELECTED_NAME = 'SET_SELECTED_NAME'
export const SET_SELECTED_ART = 'SET_SELECTED_ART'
export const FETCH_PRODUCT = 'FETCH_PRODUCT'
export const FETCH_PRODUCT_RESIVED = 'FETCH_PRODUCT_RESIVED'
export const CLOSE_MODAL_PAGE = 'CLOSE_MODAL_PAGE'
export const OPEN_MODAL_PAGE = 'OPEN_MODAL_PAGE'
export const CLEAR_CHECKED_PRODUCT = 'CLEAR_CHECKED_PRODUCT'
export const CLEAR_ALL_CHECKED_PRODUCT = 'CLEAR_ALL_CHECKED_PRODUCT'
export const DELETE_COLL_CHECK_TABLE = 'DELETE_COLL_CHECK_TABLE'


export const setFilter = (value) => ({
    type: SET_FILTER, value
})
export const setFilterID = (value) => ({
    type: SET_FILTER_ID, value
})
export const resetFilter = () => ({
    type: RESET_FILTER
})
export const fetchArt = (value) => ({
    type: FETCH_ART,value
})
export const fetchProduct = (value) => ({
    type: FETCH_PRODUCT,value
})
export const fetchName = (value) => ({
    type: FETCH_NAME,value
})
export const setModalMessage = (message) => ({
    type: SET_MODAL_MESSAGE, message
})
export const setSelectedName = (index,post) => ({
    type: SET_SELECTED_NAME, index, post
})
export const setSelectedArt = (index, post) => ({
    type: SET_SELECTED_ART, index, post
})
export const closeModal = (value) => ({
    type: CLOSE_MODAL_PAGE, value
})
export const openModal = (value) => ({
    type: OPEN_MODAL_PAGE, value
})
export const clearCheckedProduct = () => ({
    type: CLEAR_CHECKED_PRODUCT
})
export const clearALLCheckedProduct = () => ({
    type: CLEAR_ALL_CHECKED_PRODUCT
})
export const deleteCollumCheckTable = (value) => ({
    type: DELETE_COLL_CHECK_TABLE, value
})