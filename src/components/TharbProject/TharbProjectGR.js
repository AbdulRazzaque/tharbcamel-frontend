import React from 'react'
import "./GenerateReport.scss"
import { TextField,Button,IconButton,Alert } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import EditIcon from '@mui/icons-material/Edit';
import EditValueModal from './EditValueModal';
import date from 'date-and-time';
import axios from 'axios';
import {useForm} from 'react-hook-form'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import readXlsxFile from 'read-excel-file'
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const Input = styled('input')({
    display: 'none',
  });
const options = ['Option 1', 'Option 2'];
function TharbProjectGR(props) {
    console.log("generatereportprops",props)
    const {handleSubmit,register,formState:{errors},setValue}=useForm()

    const [sampleType, setSampleType] = React.useState('Blood');
    const [testRequired,setTestRequired] = React.useState('Brucella')
    const [organization,setOrganization] = React.useState(options[0])
    const [comment,setComment]=React.useState("")

    const [reportNumber,setReportNumber]=React.useState("")
    const [orderBatch,setOrderBatch]=React.useState("P1")
    const [workOrderDate,setWorkOrderDate]=React.useState("")
    const [mainDate,setMainDate]=React.useState("")
    //for single state storage for batch
    const [batchDetails,setBatchDetails] = React.useState({microchip:0,neck:0,rakumalmalik:"",bullname:""})
    //storing all batch 
    const [batchArray,setBatchArray] = React.useState([])

    //report creation hooks
    const [negative,setNegative]=React.useState([])
    const [pending,setPending]=React.useState([])
    const [positive,setPositive] = React.useState([])
    const [suspect,setSuspect] = React.useState([])
    const [noBlood,setNoBlood] = React.useState([])

    //modalHooks
    const [open,setOpen] = React.useState(false)
    const [modalData,setModalData]=React.useState({judgement:"",microchip:0})

    const [singleReportData,setSingleReportData]=React.useState(null)

    const [message,setMessage]=React.useState({type:"",message:"",batch:false})

    const [download,setDownload]=React.useState(true)
    console.log(download)

    React.useEffect(() =>{
        if(props.location.state){
            //edit 
            let editdetail = props.location.state;
            setReportNumber(`${editdetail.reportNumber.initials}-${editdetail.reportNumber.incrementalValue}`)
            setWorkOrderDate(editdetail.workOrder.initials)
            setOrderBatch(`P${editdetail.workOrder.incrementalValue}`)
            setMainDate(editdetail.mainDate)
            setValue("ownerName",editdetail.ownerName)
            setValue("requesterName",editdetail.requesterName)
            setValue("contact",editdetail.contact)
            setValue("email",editdetail.email)
            setValue("sampleQuantity",editdetail.sampleQuantity)
            setBatchArray(editdetail.batchArray)
            setNegative(editdetail.negative)
            setPending(editdetail.pending)
            setPositive(editdetail.positive)
            setNoBlood(editdetail.noBlood)
            setSuspect(editdetail.suspect)
            setSingleReportData(editdetail)
            setComment(editdetail.comment)
            setTestRequired(editdetail.testRequired)
        }else{
            //create
            setWorkOrderDate(date.format(new Date(), 'YY-MM'))
            setMainDate(date.format(new Date(), 'DD-MM-YY'))
            axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/reportproject/getSingleReportId`,{headers:{token:props.user.user}})
            .then(res=>{
                console.log(res)
                if(res.data.msg==="success" && res.data.result!==null){
                    let newIncrementalValue=res.data.result.reportNumber.incrementalValue;
                    newIncrementalValue = newIncrementalValue+1
                    setReportNumber(`${res.data.result.reportNumber.initials}-${newIncrementalValue}`)
                    let workNewIncrementalValue=res.data.result.workOrder.incrementalValue;
                    workNewIncrementalValue = workNewIncrementalValue+1
                    setOrderBatch(`P${workNewIncrementalValue}`)
                    setSingleReportData(res.data.result)
                }
                
                
            })
        }

        
    },[])

    const upload = (e)=>{
        console.log(e.target.files[0])
        let array = []
        readXlsxFile(e.target.files[0]).then((rows) => {
            console.log(rows)
            rows.map((item,index)=>{
                if(index!==0){
                    array.push({sr:item[0],microchip:item[3],neck:item[1],rakumalmalik:item[2],bullname:item[4]})
                }
            })
          setBatchArray(array)
          e.target.value=""
            // `rows` is an array of rows
            // each row being an array of cells.
          })
       
    }

    const handleBatchAdd = ()=>{
        if(!batchArray.filter(i=>i.neck===batchDetails.neck).length>0){
            setMessage({type:"",message:"",batch:false})
            setBatchArray([...batchArray,batchDetails])
        }else{
            setMessage({type:"error",message:"Batch Already Exist",batch:true})
        }
        
    }

    const createReport = ()=>{
        setPositive([])
        setSuspect([])
        setNoBlood([])
        setPending([])
        setNegative(batchArray.map(item=>({...item,name:"",bapat:"-ve",bct:"-ve",celisa:"-ve",judgement:"Negative"})))
    }

    console.log(negative,positive,pending,suspect,batchArray)

    const handleCheckboxChange = (test,hook,e)=>{
        console.log(e)
        if(hook==="negative"){
            let arr = negative.map(item=>{
                if(e.target.checked===true){
                    item[test] = "-ve";
                    // if(test==="celisa"){
                    //     item[test] = "0";
                    // }
                }else{
                    item[test] = "";
                }
                
                return item;
            })
            setNegative(arr)
        } 
        else if(hook==="pending"){
            let arr = pending.map(item=>{
                if(e.target.checked===true){
                    item[test] = "-ve";
                    // if(test==="celisa"){
                    //     item[test] = "0";
                    // }
                }else{
                    item[test] = "";
                }
                
                return item;
            })
            setPending(arr)
        } 
        
        else if(hook==="positive"){
            let arr = positive.map(item=>{
                if(e.target.checked===true){
                    item[test] = "+ve";
                    // if(test==="celisa"){
                    //     item[test] = "0";
                    // }
                }else{
                    item[test] = "";
                }
                
                return item;
            })
            setPositive(arr)
        }else if(hook==="noBlood"){
            let arr = noBlood.map(item=>{
                if(e.target.checked===true){
                    item[test] = "";
                    // if(test==="celisa"){
                    //     item[test] = "0";
                    // }
                }else{
                    item[test] = "";
                }
                
                return item;
            })
            setNoBlood(arr)
        }
        else{
            let arr = suspect.map(item=>{
                if(e.target.checked===true){
                    item[test] = "suspect";
                    // if(test==="celisa"){
                    //     item[test] = "0";
                    // }
                }else{
                    item[test] = "";
                }
                
                return item;
            })
            setSuspect(arr)
        }
    }


    const handleSubmit2 = (valueTest)=>{
        //value is the sample value for psoitive and suspect samples
        setOpen(false)
        console.log(valueTest)
        if(modalData.judgement==="Negative"){
            setNegative(
                negative.map(i=>{
                    if(i.neck===modalData.neck){
                        i[modalData.updateValue]=valueTest;
                    }
                    return i;
                })
            )
        }
        if(modalData.judgement==="Pending"){
            setPending(
                pending.map(i=>{
                    if(i.neck===modalData.neck){
                        i[modalData.updateValue]=valueTest;
                    }
                    return i;
                })
            )
        }
        
        else if(modalData.judgement==="Positive"){
            setPositive(
                positive.map(i=>{
                    if(i.neck===modalData.neck){
                        i[modalData.updateValue]=valueTest;
                    }
                    return i;
                })
            )
        }
        else if(modalData.judgement==="No Blood"){
            setNoBlood(
                noBlood.map(i=>{
                    if(i.neck===modalData.neck){
                        i[modalData.updateValue]=valueTest;
                    }
                    return i;
                })
            )
        }
        else{
            setSuspect(
                suspect.map(i=>{
                    if(i.neck===modalData.neck){
                        i[modalData.updateValue]=valueTest;
                    }
                    return i;
                })
            )
        }
    }
    console.log("modaldata",modalData)

    //form on submit
    const onSubmit = (data)=>{
        //console.log(data)
        console.log(parseInt(orderBatch.split("P")[1]))
        let newOrderNumber = parseInt(orderBatch.split("P")[1])
        if(isNaN(newOrderNumber)){
            //error condition
        }else{
            //console.log(reportNumber,`${workOrderDate}-B`,newOrderNumber,mainDate,data,sampleType,testRequired,organization)
            let obj = {
                reportNumberInitials:singleReportData.reportNumber.initials,
                reportNumberIncrementalValue:singleReportData.reportNumber.incrementalValue+1,
                workOrderInitials:`${workOrderDate}`,
                workOrderIncrementalValue:newOrderNumber,
                mainDate,
                negative,
                pending,
                positive,
                noBlood,
                suspect,
                batchArray,
                testRequired,
                sampleType,
                organization,
                comment,
                ...data
            }
            console.log(obj)
            if(props.location.state){
                //edit report
                axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/reportproject/saveReport`,{reportId:singleReportData._id,reportObject:obj},{headers:{token:props.user.user}})
                .then(res=>{
                    console.log(res)
                    if(res.data.msg==="success"){
                        setMessage({type:"success",message:"Report Saved Successfully"})
                        if(download){
                            props.history.push("/reportproject",{noBlood,negative,pending,positive,suspect,comment,reportNumber,workOrderDate,mainDate,sampleQuantity:data.sampleQuantity,ownerName:data.ownerName,workOrder:`${workOrderDate}-P${newOrderNumber}`})
                        }else{
                            window.location.reload(false);
                        }
                        
                    }else{
                        setMessage({type:"error",message:"Error in saving the report"})
                    }
                    
                })
                .catch(err=>{
                    setMessage({type:"error",message:"Error in saving the report"})
                })
            }else{
                //create report
                axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/reportproject/createReport`,obj,{headers:{token:props.user.user}})
                .then(res=>{
                    console.log(res)
                    if(res.data.msg==="success"){
                        setMessage({type:"success",message:"Report Saved Successfully"})
                        if(download){
                            props.history.push("/reportproject",{noBlood,negative,pending,positive,suspect,comment,reportNumber,workOrderDate,mainDate,sampleQuantity:data.sampleQuantity,ownerName:data.ownerName,workOrder:`${workOrderDate}-P${newOrderNumber}`})
                        }else{
                            window.location.reload(false);
                        }
                        
                    }else{
                        setMessage({type:"error",message:"Error in saving the report"})
                    }
                    
                })
                .catch(err=>{
                    setMessage({type:"error",message:"Error in saving the report"})
                })
            }
            
        }
        //let newOrderNumber = workOrderDateorderBatch
        //
        //setNegative(batchArray.map(item=>({...item,name:"",bapat:"-ve",bct:"-ve",celisa:"0",judgement:"Negative"})))
    }
    const handleChangeStatus = (addIn,removeFrom,item)=>{
        console.log("itemis",item)
        if(addIn==="Positive"){
            setPositive([...positive,{...item,judgement:"Positive",bapat:"+ve",bct:"+ve",celisa:"+ve"}])
        }
        else if(addIn==="Negative"){
            setNegative([...negative,{...item,judgement:"Negative",bapat:"-ve",bct:"-ve",celisa:"-ve"}])
        }
        else if(addIn==="Pending"){
            setPending([...pending,{...item,judgement:"Pending",bapat:"-ve",bct:"-ve",celisa:"-ve"}])
        }
        else if(addIn==="Suspect"){
            setSuspect([...suspect,{...item,judgement:"Suspect",bapat:"±ve",bct:"±ve",celisa:"±ve"}])
        }else{
            //noblood
            setNoBlood([...noBlood,{...item,judgement:"No Blood",bapat:"",bct:"",celisa:""}])
        }

        //remove from array's condidtion
        if(removeFrom==="Positive"){
            setPositive(positive.filter(i=>i.neck!==item.neck))
        }
        else if(removeFrom==="Negative"){
            setNegative(negative.filter(i=>i.neck!==item.neck))
        }
        else if(removeFrom==="Pending"){
            setPending(pending.filter(i=>i.neck!==item.neck))
        }
        else if(removeFrom==="Suspect"){
            setSuspect(suspect.filter(i=>i.neck!==item.neck))
        }else{
            //noblood
            setNoBlood(noBlood.filter(i=>i.neck!==item.neck))
        }
    }
    
  return (
    <div className="pt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
        <EditValueModal 
        open={open}
        setOpen={setOpen}
        description={`Changing the value of ${modalData.microchip} ${modalData.judgement} sample`}
        handleSubmit={handleSubmit2}
        />
        <Link className="ml-5" to="/previousreportsproject">View Previous Project Reports <KeyboardArrowRightIcon /></Link>
        <section className="generate-report">
            <h1>Generate Report Tharb Project</h1>
            <div className="row m-auto report-inputs justify-content-between">
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 report-input-head">
                    <h2>Report Info</h2>
                    <TextField disabled onChange={(e)=>setReportNumber(e.target.value)} value={reportNumber} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Report Number" />
                    <TextField onChange={(e)=>setOrderBatch(e.target.value)} value={orderBatch} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Work Order Batch" />
                    <p>Work Order: <b>{workOrderDate}-{orderBatch}</b></p>
                    <TextField onChange={(e)=>setMainDate(e.target.value)} value={mainDate} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Date" />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 report-input-head">
                <h2>Personal Info</h2>
                    <TextField {...register('ownerName',{required:true})} error={errors.ownerName?true:false} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Owner Name" />
                    <TextField {...register('requesterName')} error={errors.requesterName?true:false} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Requester Name" />
                    <TextField {...register('contact')} error={errors.contact?true:false} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Contact" />
                    <TextField {...register('email')} error={errors.email?true:false} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Email" />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 report-input-head">
                <h2>Blood Sample Info</h2>
                <Autocomplete
                value={sampleType}
                onChange={(event, newValue) => {
                setSampleType(newValue);
                }}
                id="controllable-states-demo"
                options={['Blood']}
                fullWidth
                renderInput={(params) => <TextField className="my-3" {...params} label="Sample Type" />}
                />
                <TextField {...register('sampleQuantity',{required:true})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Sample Quantity" />
                <Autocomplete
                value={testRequired}
                onChange={(event, newValue) => {
                setTestRequired(newValue);
                }}
                id="controllable-states-demo"
                options={['Brucella',"Brucella + cElisa"]}
                
                fullWidth
                renderInput={(params) => <TextField className="my-3" {...params} label="Test Required" />}
                />
                <Autocomplete
                value={organization}
                onChange={(event, newValue) => {
                setOrganization(newValue);
                }}
                id="controllable-states-demo"
                options={options}
                fullWidth
                renderInput={(params) => <TextField className="my-3" {...params} label="Organization" />}
                />
                </div>
            </div>
            {/* batch creation start----------------------------- */}
            <div className="mt-4 mb-2" style={{textAlign:"center"}}>
                    <label htmlFor="contained-button-file">
                    <Input 
                    onChange={upload}
                    accept=".xlsx,.xls,.csv" id="contained-button-file" multiple type="file" />
                    <Button variant="contained" component="span" endIcon={<UploadFileIcon />}>
                    Upload Excel
                    </Button>
                    </label>
                    </div>

            <section className="batch-container">
            <h2>Create Batches For Report</h2>
            <h5>Report will be generated for the batches that will be entered</h5>
            <div className="row m-auto batch-head justify-content-around">
                <div className="col-4 batch-child-1">
                <h2>Create Batch</h2>
                <TextField onChange={(e)=>setBatchDetails({...batchDetails,microchip:e.target.value})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Microchip Number" />
                <TextField onChange={(e)=>setBatchDetails({...batchDetails,neck:e.target.value})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Neck Number" />
                <TextField onChange={(e)=>setBatchDetails({...batchDetails,rakumalmalik:e.target.value})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Rakumalmalik" />
                <TextField onChange={(e)=>setBatchDetails({...batchDetails,bullname:e.target.value})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Bullname" />
                <div className="my-3" style={{textAlign:"center"}}>
                {message.batch&&<Alert className="my-3" severity={message.type}>{message.message}</Alert>}
                <Button onClick={()=>handleBatchAdd()} variant="contained">Create Batch</Button>
                </div>

                </div>
                <div className="col-7 batch-child">
                {batchArray.length>0?<table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Rakumalmalik</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Bullname</th>
                    <th></th>
                </tr></thead>
                <tbody>
                    {
                        batchArray.map((item,index)=>(
                            <tr key={index}>
                            <td>{item.sr?item.sr:index+1}</td>
                            <td>{item.rakumalmalik}</td>
                            <td>{item.microchip}</td>
                            <td>{item.neck}</td>
                            <td>{item.bullname}</td>
                            <td style={{textAlign:"center"}}>
                                <IconButton color="error" onClick={()=>{
                                    setBatchArray(batchArray.filter(i=>item.neck!==i.neck))
                                }} >
                                    <DeleteOutlineIcon sx={{fontSize:20}} />
                                </IconButton>
                            </td>
                            </tr>
                        ))
                    }
                </tbody>
                </table>:<p style={{color:"red",fontWeight:"bold"}}>No Batches Added Yet</p>}
                </div>
            </div>
            </section>

            {/* batch creation end----------------------------- */}

            {/* report mapping----------------------------- */}


            {(negative?.length>0 || pending?.length>0 || positive?.length>0 || suspect?.length>0 || noBlood?.length>0)&&<section className="generated-report-section">
            <h1>Generated Report</h1>

            {negative?.length>0&&<div className="sample-div">
            <h2 className="my-5">Negative Samples</h2>
            <table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Rakumalmalik</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Bullname</th>
                    <th>Name</th>
                    <th>BAPAT</th>
                    <th>RBT</th>
                    <th>cElisa</th>
                    <th>judgement</th>
                    <th>Change Judgement</th>
                </tr></thead>
            <tbody>
            {
                negative?.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.sr?item.sr:index+1}</td>
                        <td>{item.rakumalmalik}</td>
                        <td>{item.microchip}</td>
                        <td>{item.neck}</td>
                        <td>{item.bullname}</td>
                        <td>{item.name}</td>
                        <td>{item.bapat} {item.bapat&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bapat"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.bct} {item.bct&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bct"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.celisa} {item.celisa&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"celisa"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td style={{color:"blue"}}>{item.judgement.toUpperCase()}</td>
                        <td>
                        <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Select Status</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={item.judgement}
                            onChange={(e)=>{
                                console.log(e)
                                if(e.target.value==="Positive"){
                                    handleChangeStatus("Positive",item.judgement,item)
                                }
                                else if(e.target.value==="Pending"){
                                    handleChangeStatus("Pending",item.judgement,item)
                                }
                                else if(e.target.value==="No Blood"){
                                    handleChangeStatus("No Blood",item.judgement,item)
                                }
                                else{
                                    handleChangeStatus("Suspect",item.judgement,item)
                                }
                            }}
                        >
                            <FormControlLabel value="Negative" disabled={item.judgement==="Negative"?true:false} control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Pending" disabled={item.judgement==="Pending"?true:false} control={<Radio  />} label="Pending" />
                            <FormControlLabel value="Positive" disabled={item.judgement==="Positive"?true:false} control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect" disabled={item.judgement==="Suspect"?true:false}  control={<Radio />} label="Suspect" />
                            <FormControlLabel value="No Blood" disabled={item.judgement==="No Blood"?true:false}  control={<Radio />} label="No Blood" />
                        </RadioGroup>
                        </FormControl>
                        </td>
                    </tr>
                ))
            }
             </tbody>
            </table>
            <FormGroup
            row
            >
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bapat","negative",e)} control={<Checkbox defaultChecked />} label="BAPAT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bct","negative",e)} control={<Checkbox defaultChecked />} label="BCT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("celisa","negative",e)} control={<Checkbox defaultChecked />} label="cElisa" />
            </FormGroup>
            </div>}


            {pending?.length>0&&<div className="sample-div">
            <h2 className="my-5">Pending Samples</h2>
            <table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Rakumalmalik</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Bullname</th>
                    <th>Name</th>
                    <th>BAPAT</th>
                    <th>RBT</th>
                    <th>cElisa</th>
                    <th>judgement</th>
                    <th>Change Judgement</th>
                </tr></thead>
            <tbody>
            {
                pending?.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.sr?item.sr:index+1}</td>
                        <td>{item.rakumalmalik}</td>
                        <td>{item.microchip}</td>
                        <td>{item.neck}</td>
                        <td>{item.bullname}</td>
                        <td>{item.name}</td>
                        <td>{item.bapat} {item.bapat&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bapat"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.bct} {item.bct&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bct"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.celisa} {item.celisa&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"celisa"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td style={{color:"red"}}>{item.judgement.toUpperCase()}</td>
                        <td>
                        <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Select Status</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={item.judgement}
                            onChange={(e)=>{
                                console.log(e)
                                if(e.target.value==="Negative"){
                                    handleChangeStatus("Negative",item.judgement,item)
                                }
                                 
                                else if(e.target.value==="No Blood"){
                                    handleChangeStatus("No Blood",item.judgement,item)
                                }
                                    else if(e.target.value==="Suspect"){
                                    handleChangeStatus("Suspect",item.judgement,item)
                                }
                                else{
                                   handleChangeStatus("Positive",item.judgement,item)
                                }
                            }}
                        >
                            <FormControlLabel value="Negative"  control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Pending" disabled control={<Radio  />} label="Pending" />
                            <FormControlLabel value="Positive"  control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect"  control={<Radio />} label="Suspect" />
                            <FormControlLabel value="No Blood" disabled={item.judgement==="No Blood"?true:false}  control={<Radio />} label="No Blood" />
                        </RadioGroup>
                        </FormControl>
                        </td>
                    </tr>
                ))
            }
             </tbody>
            </table>
            <FormGroup
            row
            >
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bapat","pending",e)} control={<Checkbox defaultChecked />} label="BAPAT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bct","pending",e)} control={<Checkbox defaultChecked />} label="BCT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("celisa","pending",e)} control={<Checkbox defaultChecked />} label="cElisa" />
            </FormGroup>
            </div>}
            {positive?.length>0&&<div className="sample-div">
            <h2 className="my-5">Positive Samples</h2>
            <table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Rakumalmalik</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Bullname</th>
                    <th>Name</th>
                    <th>BAPAT</th>
                    <th>RBT</th>
                    <th>cElisa</th>
                    <th>judgement</th>
                    <th>Change Judgement</th>
                </tr></thead>
            <tbody>
            {
                positive?.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.sr?item.sr:index+1}</td>
                        <td>{item.rakumalmalik}</td>
                        <td>{item.microchip}</td>
                        <td>{item.neck}</td>
                        <td>{item.bullname}</td>
                        <td>{item.name}</td>
                        <td>{item.bapat} {item.bapat&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bapat"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.bct} {item.bct&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bct"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.celisa} {item.celisa&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"celisa"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td style={{color:"red"}}>{item.judgement.toUpperCase()}</td>
                        <td>
                        <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Select Status</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={item.judgement}
                            onChange={(e)=>{
                                console.log(e)
                                if(e.target.value==="Negative"){
                                    handleChangeStatus("Negative",item.judgement,item)
                                }
                                else if(e.target.value==="Pending"){
                                    handleChangeStatus("Pending",item.judgement,item)
                                }
                                else if(e.target.value==="No Blood"){
                                    handleChangeStatus("No Blood",item.judgement,item)
                                }
                                else{
                                    handleChangeStatus("Suspect",item.judgement,item)
                                }
                            }}
                        >
                            <FormControlLabel value="Negative"  control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Pending"  control={<Radio  />} label="Pending" />
                            <FormControlLabel value="Positive" disabled control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect"  control={<Radio />} label="Suspect" />
                            <FormControlLabel value="No Blood" disabled={item.judgement==="No Blood"?true:false}  control={<Radio />} label="No Blood" />
                        </RadioGroup>
                        </FormControl>
                        </td>
                    </tr>
                ))
            }
             </tbody>
            </table>
            <FormGroup
            row
            >
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bapat","positive",e)} control={<Checkbox defaultChecked />} label="BAPAT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bct","positive",e)} control={<Checkbox defaultChecked />} label="BCT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("celisa","positive",e)} control={<Checkbox defaultChecked />} label="cElisa" />
            </FormGroup>
            </div>}


            {suspect?.length>0&&<div className="sample-div">
            <h2 className="my-5">Suspect Samples</h2>
            <table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Rakumalmalik</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Bullname</th>
                    <th>Name</th>
                    <th>BAPAT</th>
                    <th>RBT</th>
                    <th>cElisa</th>
                    <th>judgement</th>
                    <th>Change Judgement</th>
                </tr></thead>
            <tbody>
            {
                suspect?.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.sr?item.sr:index+1}</td>
                        <td>{item.rakumalmalik}</td>
                        <td>{item.microchip}</td>
                        <td>{item.neck}</td>
                        <td>{item.bullname}</td>
                        <td>{item.name}</td>
                        <td>{item.bapat} {item.bapat&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bapat"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.bct} {item.bct&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bct"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.celisa} {item.celisa&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"celisa"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td style={{color:"green"}}>{item.judgement.toUpperCase()}</td>
                        <td>
                        <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Select Status</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={item.judgement}
                            onChange={(e)=>{
                                console.log(e)
                                if(e.target.value==="Negative"){
                                    handleChangeStatus("Negative",item.judgement,item)
                                }
                                else if(e.target.value==="Pending"){
                                    handleChangeStatus("Pending",item.judgement,item)
                                }
                                
                                else if(e.target.value==="No Blood"){
                                    handleChangeStatus("No Blood",item.judgement,item)
                                }
                                else{
                                    handleChangeStatus("Positive",item.judgement,item)
                                }
                            }}
                        >
                            <FormControlLabel value="Negative"  control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Pending"  control={<Radio  />} label="Pending" />
                            <FormControlLabel value="Positive"  control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect" disabled control={<Radio />} label="Suspect" />
                            <FormControlLabel value="No Blood" disabled={item.judgement==="No Blood"?true:false}  control={<Radio />} label="No Blood" />
                        </RadioGroup>
                        </FormControl>
                        </td>
                    </tr>
                ))
            }
             </tbody>
            </table>
            <FormGroup
            row
            >
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bapat","suspect",e)} control={<Checkbox defaultChecked />} label="BAPAT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bct","suspect",e)} control={<Checkbox defaultChecked />} label="BCT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("celisa","suspect",e)} control={<Checkbox defaultChecked />} label="cElisa" />
            </FormGroup>
            </div>}

            {noBlood?.length>0&&<div className="sample-div">
            <h2 className="my-5">No Blood Samples</h2>
            <table className="ui celled table">
                <thead>
                    <tr><th>Sr No</th>
                    <th>Microchip</th>
                    <th>Neck</th>
                    <th>Name</th>
                    <th>BAPAT</th>
                    <th>RBT</th>
                    <th>cElisa</th>
                    <th>judgement</th>
                    <th>Change Judgement</th>
                </tr></thead>
            <tbody>
            {
                noBlood?.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.sr?item.sr:index+1}</td>
                        <td>{item.microchip}</td>
                        <td>{item.neck}</td>
                        <td>{item.name}</td>
                        <td>{item.bapat} {item.bapat&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bapat"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.bct} {item.bct&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"bct"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td>{item.celisa} {item.celisa&&<IconButton onClick={()=>{
                            setModalData({...item,updateValue:"celisa"})
                            setOpen(true)
                        }}><EditIcon sx={{fontSize:18}} /></IconButton>}</td>
                        <td style={{color:"green"}}>{item.judgement.toUpperCase()}</td>
                        <td>
                        <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Select Status</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={item.judgement}
                            onChange={(e)=>{
                                console.log(e)
                                if(e.target.value==="Negative"){
                                    handleChangeStatus("Negative",item.judgement,item)
                                }
                                else if(e.target.value==="Pending"){
                                    handleChangeStatus("Pending",item.judgement,item)
                                }
                                else if(e.target.value==="Positive"){
                                    handleChangeStatus("Positive",item.judgement,item)
                                }
                                else{
                                    handleChangeStatus("Suspect",item.judgement,item)
                                }
                            }}
                        >
                            {/* <FormControlLabel value="Negative"  control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Positive"  control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect" disabled control={<Radio />} label="Suspect" /> */}
                            <FormControlLabel value="Negative" disabled={item.judgement==="Negative"?true:false} control={<Radio  />} label="Negative" />
                            <FormControlLabel value="Pending" disabled={item.judgement==="Pending"?true:false} control={<Radio  />} label="Pending" />
                            <FormControlLabel value="Positive" disabled={item.judgement==="Positive"?true:false} control={<Radio  />} label="Positive" />
                            <FormControlLabel value="Suspect" disabled={item.judgement==="Suspect"?true:false}  control={<Radio />} label="Suspect" />
                            <FormControlLabel value="No Blood" disabled={item.judgement==="No Blood"?true:false}  control={<Radio />} label="No Blood" />
                        </RadioGroup>
                        </FormControl>
                        </td>
                    </tr>
                ))
            }
             </tbody>
            </table>
            <FormGroup
            row
            >
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bapat","noBlood",e)} control={<Checkbox defaultChecked />} label="BAPAT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("bct","noBlood",e)} control={<Checkbox defaultChecked />} label="BCT" />
            <FormControlLabel onChange={(e)=>handleCheckboxChange("celisa","noBlood",e)} control={<Checkbox defaultChecked />} label="cElisa" />
            </FormGroup>
            </div>}

        <div style={{textAlign:"center"}}>
            <h2>Add a Comment</h2>
        <TextField
          id="filled-multiline-flexible"
          label="Enter Comment"
          multiline
          rows={4}
          sx={{width:500}}
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          variant="filled"
        />
        </div>

        {/* <div className="my-4" style={{textAlign:"center"}}>
        <p className={message.type}>{message.message}</p>
        <Button type="submit" variant="outlined">Save Report</Button>
        </div> */}
    <div className="my-4 checkbox-container" style={{textAlign:"center"}}>
    <FormGroup>
      <FormControlLabel onChange={(e)=>setDownload(e.target.checked)} control={<Checkbox defaultChecked />} label="Download Report" />
    </FormGroup>
    </div>


        <div className="my-4" style={{textAlign:"center"}}>

        {(message.message.length>0&&message.batch===false)&&<Alert className="my-3 mx-5" severity={message.type}>{message.message}</Alert>}
        <Button type="submit" 
        // startIcon={<DownloadIcon />} 
        variant="contained">Submit Report</Button>
        </div>
        
        </section>}




            <div className="mt-5 pt-5" />








        </section>
        <div style={{position:"fixed",bottom:"5%",right:"5%"}}>
              <Tooltip title="Create Report">
              <Fab onClick={()=>createReport()}
               variant="extended" color="primary" aria-label="add">
              Create Report
                <NoteAddIcon  sx={{ marginLeft:1,fontSize:"1.2em"}} />  
              </Fab>
              </Tooltip>
        </div>
        </form>
    </div>
  )
}

const mapStateToProps = ({EventUser})=>{
    return {
        user:EventUser
    }
}

export default connect(mapStateToProps)(TharbProjectGR)