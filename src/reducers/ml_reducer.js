
import  * as types from "../actions/types";
import _ from 'lodash'

const initialState={ 
};
    

const patientReducer = (state = initialState, action) => {

switch(action.type){
   
    case types.CATCH_ERROR:{
        return {...state,errors:action.payload}
    }
    default:{
        return {...state,errors:null};
    }
}
}

export default patientReducer;