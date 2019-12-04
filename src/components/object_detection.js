import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
 import { connect } from "react-redux";
import _ from 'lodash'
import Webcam from "react-webcam";
import moment from "moment"
import Popup from "reactjs-popup";
import * as ml_action   from "../actions/ml_action";
import { baseImageUrl } from "../config";
import 'rc-slider/assets/index.css';
 import Slider from 'rc-slider';
 import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import '../assets/css/theme.css'
import '../assets/css/skins/default.css'
import '../assets/css/custom.css'
import { ToastContainer, toast } from 'react-toastify';
let coordinate={}
let time=0
  let  rects=[]
  let labelForm=""
let contexts = ""
let image = new Image;
let modelForm=""
class ScanConponent extends Component {
    constructor(props) {
        super();
        this.state = { 
          imageSets:[],
          statusOption:['Open','Closed','Attention'],
          scanObject:{},
          playInd:0,
          discoveryName:"",
          discoveryDetail:"",
          showPopup:false,
          recording:false,
          webCamError: "",
          imageSrc:"",
          playingExistingVideo:false,
          mouseX:null,
          mouseY:null,
          takeCoordinate:false,
          sourceImageBase64:'',
          discoveryArray:[],
          playingImage:false,
          createDiscovery:false,
          patientDetail:{},
          viewDiscoveryImage:"",
          discoveryObj:{},
          playDisable:false,
          camWidth:640,
          fps:200,
          status:""
        }
          this.playInd=0
          this.dr=null
          this.playImageIn=null
          this.startRecordInterval=null
    }
  
      componentWillReceiveProps(nextProps){
           
      }

      HistoryPush=(path)=>{
        this.props.history.push(path)
      
     }
    setRef = webcam => {
        this.webcam = webcam;
    };

   
    stopRecord=()=>{
 
        clearInterval(this.startRecordInterval)
    }
    
    capture = () => {
        time=time+1
if(this.webcam){
    let imageSrc = this.webcam.getScreenshot();
    let context = this.canvasElement.getContext('2d');
    contexts=this.canvasElement.getContext('2d');
     context.drawImage(image, 0, 0);
   image.src = imageSrc
  
   var formData = new FormData();
   formData.append("image",imageSrc)
   formData.append("scan_id",this.state.scanObject.id)
   formData.append("patient_id",this.state.scanObject.patientId)
   formData.append("process","start")
   formData.append("timeStamp", Date.now())

   context.beginPath();
  
    this.setState({imageSrc:imageSrc})
}
         
     };

    onUserMediaError = (event) => {
        
         this.setState({
           webCamError:"Cam not found"
        })
    }
         
     saveImageWithCoordinates=(XValue,YValue)=>{
     coordinate={}
    rects.forEach(element=>{
       if(element.x===XValue&&element.y===YValue){
        coordinate= element
        
      }
    })

        // if(!_.isEmpty(coordinate)){
        //   this.setState({formData})
        // }
     
    
     }
      collides(rectss, x, y) {
      var isCollision = false;
      for (var i = 0, len = rectss.length; i < len; i++) {
          var left = rectss[i].x, right = rectss[i].x+rectss[i].w;
          var top = rectss[i].y, bottom = rectss[i].y+rectss[i].h;
          // console.log(left,top)
          if (right >= x
              && left <= x
              && bottom >= y
              && top <= y) {
              isCollision = rectss[i];
          }
      }
      return isCollision;
    }
  
      handleMouseClick=(e)=>{
       function collides(rectss, x, y) {
            var isCollision = false;
            for (var i = 0, len = rectss.length; i < len; i++) {
                var left = rectss[i].x, right = rectss[i].x+rectss[i].w;
                var top = rectss[i].y, bottom = rectss[i].y+rectss[i].h;
                if (right >= x
                    && left <= x
                    && bottom >= y
                    && top <= y) {
                    isCollision = rectss[i];
                }
            }
            return isCollision;
          }


          var rect = collides(rects, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    console.log(rect)

          if (rect) {
             this.setState({showPopup:true,createDiscovery:true})
             return this.saveImageWithCoordinates(rect.x ,rect.y)  
          } else {
          }
        this.setState({
          mouseX:e.nativeEvent.offsetX,//e.screenX,
          mouseY:e.nativeEvent.offsetY,//e.screenY,
          shallMouseMove:true
        })
      }
 
      handleMouseEvent=(e)=>{
         if(this.state.shallMouseMove==true){ 
          this.setState({takeCoordinate:true})
          let width=e.nativeEvent.offsetX- this.state.mouseX;
          let height=e.nativeEvent.offsetY- this.state.mouseY
    
          contexts.clearRect(0,0,this.canvasElement.width,this.canvasElement.height); 
          contexts.drawImage(image, 0, 0);

          contexts.lineWidth = "2";
          contexts.strokeStyle = 'red';
          contexts.strokeRect(this.state.mouseX, this.state.mouseY, width,height);
        }
      }

      handleMouseRelease=(e)=>{
       
        
        
        const context = this.canvasElement.getContext('2d');
        if(this.state.shallMouseMove==true&&this.state.takeCoordinate==true){
            // image.src =this.state.imageSrc
          this.setState({
              
            takeCoordinate:false})
          let width=(e.nativeEvent.offsetX-this.canvasElement.offsetLeft)- this.state.mouseX;
          let height=(e.nativeEvent.offsetY-this.canvasElement.offsetTop)- this.state.mouseY
           rects.push({x: this.state.mouseX, y: this.state.mouseY, w: width, h: height})

           rects.forEach((element,index)=>{
            // context.fillText("Person "+index, element.x, element.y);
            context.rect(element.x, element.y, element.w, element.h)
            //  rects.push({x: element.x, y: element.y, w: element.w, h: element.h})
            context.stroke()
            context.beginPath();
          })
         }
  
        this.setState({
          takeCoordinate:false,
          shallMouseMove:false
        })
      }
       
    handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
    }
    
     closeHandle=()=>{
        this.setState({showPopup:!this.state.showPopup,
           discoveryDetail:"",
           viewDiscoveryImage:"",
           discoveryName:""
       })
       }
    
        startStreaming=(e)=>{
        // alert("Streaming is Started")
         let imageSrc = this.webcam.getScreenshot();
          var formData = new FormData();
          imageSrc=imageSrc.split('base64,')[1]
          // console.log(imageSrc)
          // imageSrc=""
          formData.append("b64_string",imageSrc)
          this.setState({imageSrc})
          this.props.getDetection(formData).then(res=>console.log(res))
      }
      stopStreaming=()=>{
        this.setState({imageSrc:""})
        alert("Streaming is Stoped")
      }
      uploadModelAndLabel=()=>{
        let formData= new FormData();
        formData.append("model",modelForm)
        formData.append("labels",labelForm)
          
        console.log(formData,modelForm,labelForm)
        this.props.upload_model(formData).then(res=>{
          console.log(res)
        })
      }
      uploadModel=(e)=>{
        modelForm=e.target.files[0]
        console.log(modelForm)
      }
      uploadLabel=(e)=>{
        labelForm=e.target.files[0]
      }
    render() {
        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        const Range = createSliderWithTooltip(Slider.Range);
        const videoConstraints = {
            width: this.state.camWidth,
            height: 480,
         };
        const Handle = Slider.Handle;
        const handle = (props) => {
            const { value, dragging, index, ...restProps } = props;
            return (
                <Tooltip
                    prefixCls="rc-slider-tooltip"
                    overlay={value}
                    visible={dragging}
                    placement="top"
                    key={index}
                >
                    <Handle value={value} {...restProps} />
                </Tooltip>
            );
        }
          return (
            <div>
                  {this.state.showPopup===true?

                   <Popup
                   open={this.state.showPopup}
                   closeOnDocumentClick
                   onClose={e=>this.setState({viewDiscoveryImage:"",showPopup:!this.state.showPopup})}
                  >
                    {this.state.viewDiscoveryImage===""?
                        this.state.createDiscovery===true?this.createDiscovery():this.editDiscovery()
                    :
                    <div className="model-close">
                    <div>
                    <b> Discovery Image </b>
                        <a className="close" onClick={e=>this.closeHandle()}>
                        &times;
                        </a>
                    </div>
                        <img src={this.state.viewDiscoveryImage} alt={this.state.viewDiscoveryImage} 
                    className="embed-responsive-item" />
              </div>
                    }
                 </Popup>

                :null}
                <section role="main" className="">
					 
                   <div className=" ">
						<div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 mb-4 mb-xl-0 mt-sm-3 mydiv">
							<section className="card">
                            <span className="d-inline text-center mb-3 fbr">
                            <div className="text-center">
                                    <div class="custom-file col-md-5">
                                        <input type="file" onChange={e=>this.uploadModel(e)} class="custom-file-input"accept=".pb" id="customFile" />
                                        <label class="custom-file-label" for="customFile" >Choose Model</label>
                                    </div>
                                    <div class="custom-file col-md-5 ml-2">
                                        <input type="file" onChange={e=>this.uploadLabel(e)} class="custom-file-input"accept=".pbtxt" id="customFile" />
                                        <label class="custom-file-label" for="customFile" >Choose Label</label>
                                    </div>
                                    <button className="btn btn-danger ml-1" onClick={e=>this.uploadModelAndLabel()}>Upload Files</button>

                                </div>
                           </span>
								<div className="card-body">
									<div className="row">
                                        <div className="col-12">
                                            <div className="embed-responsive embed-responsive-21by9 obj-fit-cover marg-auto">
                                             {/* {this.state.playingExistingVideo===true&&this.state.imageSrc?

                            this.state.imageSrc.split("-").length>1?
                            <img src={baseImageUrl+this.state.imageSrc} alt={baseImageUrl+this.state.imageSrc} 
                            className={this.state.imageSrc!==""?"embed-responsive-item ":"embed-responsive-item d-none"} /> :
                                                                    
                            <img src={this.state.imageSrc} alt={this.state.imageSrc} 
                            className={this.state.imageSrc!==""?"embed-responsive-item ":"embed-responsive-item d-none"} />
                                                   
                                                
                                                : <canvas id="canvas"
                                                onMouseUp={(e)=>this.handleMouseRelease(e)} 
                                                onMouseDownCapture={(e)=>this.handleMouseClick(e)}
                                                onMouseMove={(e,canvas)=>this.handleMouseEvent(e,canvas)}
                                              className={this.state.imageSrc!==""?"embed-responsive-item":"embed-responsive-item d-none"}
                                              width="640" height="480" 
                                              ref={(input) => this.canvasElement = input} />} */}
                                              <img className={this.state.imageSrc!==""?"embed-responsive-item":"embed-responsive-item d-none"}
                                                  src={"data:image/jpeg;base64,"+this.state.imageSrc}
                                                  ></img>
                                      
                                            {this.state.webCamError===""?
                                             <Webcam className={this.state.imageSrc===""?"embed-responsive-item":" embed-responsive-item d-none"}  
                                              audio={false}   ref={this.setRef}   
                                               videoConstraints={videoConstraints}
                                            screenshotFormat="image/jpeg" onUserMediaError={e=>this.onUserMediaError(e)}  />
                                            :<h1 className="embed-responsive-item fs18 text-center" style={{color:"red"}}>Webcam not found!</h1>} 
                                            </div>
                                        </div>
                                    </div>
								</div>
                                <span className="d-inline text-center"><button className="btn btn-success col-md-5" onClick={e=>this.startStreaming()}>Start Stream</button>
                                <button className="btn btn-danger col-md-5 ml-2" onClick={e=>this.stopStreaming()}>Stop Stream</button>
                                </span>
							</section>
						</div>
						
                        </div>
                   
                </section>
                <ToastContainer/>
            </div>
        )
    }
}
 const mapStateToProps = (state) => {
      return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        // getAllDiscovery:(scanObj,scanId)=>{dispatch(discoveryAction.getDiscovery(scanObj,scanId))},
        getDetection:(formData)=>{return dispatch(ml_action.getDetectImage(formData))},
        upload_model:(formData)=>{return dispatch(ml_action.upload_model(formData))},

        
        // 
        
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScanConponent));