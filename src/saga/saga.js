import {
    FETCH_ART,
    FETCH_ART_RESIVED,
    LOG_IN_FAILED,
    FETCH_NAME,
    FETCH_NAME_RESIVED,
    FETCH_PRODUCT,
    FETCH_PRODUCT_RESIVED,
} from "../redux/action";

import {put, takeLatest, all} from 'redux-saga/effects';
//users?id=25&name=vasya&
/**saga getArtCode */
function* fetchArt(action) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.value)
    }
    try {
        let newArt = []
    let data = yield fetch(process.env.REACT_APP_SAGA_API+'checkArtcode', options)
        .then(response => response.json());
        console.log(data)
    yield put({type: FETCH_ART_RESIVED, data: newArt});
    } catch (error) {
        yield put({type: LOG_IN_FAILED, data: false});
    }
}

function* fetchGetArtWatcher() {
    yield takeLatest(FETCH_ART, fetchArt)
}

function* getProductWatcher() {
    yield takeLatest(FETCH_PRODUCT, fetchProduct)
}
export default function* rootSaga() {
    yield all([
        fetchGetArtWatcher(),
        fetchGetNameWatcher(),
        getProductWatcher(),
    ])
}
  