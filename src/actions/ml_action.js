import * as types from "./types";
 import { baseUrl } from "../config";
import Axios from 'axios'

export const getDetectImage = (b64) => {
       return function action(dispatch) {
        return Axios.post(baseUrl + `get_image`,b64).then(res=>{
          // return res
             let  response = res['data']['data']
                if (res.status === 200) {
                   return  dispatch( {type: types.GET_IMAGE,payload:response} )
                  }else{
                   return dispatch( {type:types.ERROR,payload:response})
                  }      
                }).catch(err => {
                  console.log(err)
           })
         }
}
export const upload_model = (model,file) => {
  return function action(dispatch) {
   return Axios.post(baseUrl + `upload_model`,file).then(res=>{
    //  return res
        let  response = res['data']['data']
           if (res.status === 200) {
              return  dispatch( {type: types.GET_IMAGE,payload:response} )
             }else{
              return dispatch( {type:types.ERROR,payload:response})
             }      
           }).catch(err => {
             console.log(err)
              
      })
    }
}

