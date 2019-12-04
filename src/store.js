 
import thunk from "redux-thunk";
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import {rootreducer} from "./reducers";
import {applyMiddleware,createStore} from "redux"


 export default createStore(rootreducer,applyMiddleware(thunk, promise(),logger));