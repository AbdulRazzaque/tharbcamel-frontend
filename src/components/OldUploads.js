import React from 'react'
import readXlsxFile from 'read-excel-file'
import { Button} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import moment from 'moment'
const Input = styled('input')({
    display: 'none',
  });

function OldUploads(props) {
    const [arrays,setArrays] = React.useState([])
    const [arrays2,setArrays2] = React.useState([])
    React.useEffect(()=>{
        axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/report/getOldReports`)
        .then(res=>{
            console.log(res)
            //let newarray = res.data[0].array.map(item=>({reportNumber:item[0],batch:item[1],date:item[2],microchip:item[3],neck:item[4],name:item[5],bapat:item[6],bct:item[6],celisa:item[6],judgement:item[7]}))
            let arr = res.data.map((item,index)=>({...item,id:index+1}))
            setArrays(arr)
            axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/report/getOldProjectReports`)
            .then(res=>{
                console.log(res)
                let arr = res.data.map((item,index)=>({...item,id:index+1}))
                setArrays2(arr)
            })
        })
    },[])
    const upload = (e)=>{
        console.log("inside upload")
        console.log(e.target.files[0])
        let filteredArray = []
        let allDocs = []
        let keys= [
            "ReportNumber",
            "WorkOrder",
            "Date",
            "Microchip",
            "Neck",
            "CamelName",
            "BAPAT",
            "BCT",
            "cELISA",
            "JUDGEMENT"
        ]
        readXlsxFile(e.target.files[0]).then((rows) => {
            //console.log(rows)
            for(let i=0;i<=rows.length-1;i++){
                if(!rows[i].includes("ReportNumber")){
                    filteredArray.push(rows[i])
                }
            }
            let newDoc = filteredArray.map(item=>({reportNumber:item[0],batch:item[1],date:item[2],microchip:item[3],neck:item[4],bullName:item[5],bapat:item[6],bct:item[7],celisa:item[8],judgement:item[9]}))
            // axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/report/storeOldReport`,{data:newDoc})
            // .then(res=>{
            //     console.log(res)
            // })
            console.log(newDoc)
        })
        //     let obj={
        //         reportNumberString:"",
        //         reportNumber:{
        //             initials:"",
        //             incrementalValue:1
        //         },
        //         workOrder:{
        //             initials:"",
        //             incrementalValue:1
        //         },
        //         negative:[],
        //         positive:[],
        //         suspect:[],
        //         ownerName:"",
        //         requesterName:"",
        //         contact:9665276786,
        //         email:"",
        //         sampleType:"Blood",
        //         sampleQuantity:1,
        //         testRequired:"Brucella",
        //         organization:"",
        //         batchArray:"",
        //         userCreated:"",
        //         mainDate:"",
        //         comment:""
        //     }
        //     let newObj = obj;
        //     for(let j=0;j<filteredArray.length-1;j++){
        //         if(filteredArray[j][0] === filteredArray[j+1][0]){ //check if first entry is equal to second
        //             //same document, just update the microchip data
        //             newObj.reportNumberString = filteredArray[j][0];
        //             newObj.reportNumber.initials = filteredArray[j][0];
        //             newObj.workOrder.initials = filteredArray[j][1];
        //             newObj.batchArray = {microchip:filteredArray[j][3],neck:filteredArray[j][4]}
        //             let o = {microchip:filteredArray[j][3],neck:filteredArray[j][4],name:filteredArray[j][5],bapat:filteredArray[j][6],bct:filteredArray[j][7],celisa:filteredArray[j][8],judgement:filteredArray[j][9]}
        //             if(filteredArray[j][9]==="NEGATIVE"){
        //                 newObj.negative.push(o)
        //             }else if(filteredArray[j][9]==="POSITIVE"){
        //                 newObj.positive.push(o)
        //             }else{
        //                 newObj.suspect.push(o)
        //             }
    
        //         }else{
        //             console.log(newObj)
        //             allDocs.push(newObj)
        //             newObj = {
        //                 reportNumberString:"",
        //                 reportNumber:{
        //                     initials:"",
        //                     incrementalValue:1
        //                 },
        //                 workOrder:{
        //                     initials:"",
        //                     incrementalValue:1
        //                 },
        //                 negative:[],
        //                 positive:[],
        //                 suspect:[],
        //                 ownerName:"",
        //                 requesterName:"",
        //                 contact:9665276786,
        //                 email:"",
        //                 sampleType:"Blood",
        //                 sampleQuantity:1,
        //                 testRequired:"Brucella",
        //                 organization:"",
        //                 batchArray:"",
        //                 userCreated:"",
        //                 mainDate:"",
        //                 comment:""
        //             };
        //             //different doucment create a new object
        //             newObj.reportNumberString = filteredArray[j][0];
        //             newObj.reportNumber.initials = filteredArray[j][0];
        //             newObj.workOrder.initials = filteredArray[j][1];
        //             newObj.batchArray = {microchip:filteredArray[j][3],neck:filteredArray[j][4]}
        //             let o = {microchip:filteredArray[j][3],neck:filteredArray[j][4],name:filteredArray[j][5],bapat:filteredArray[j][6],bct:filteredArray[j][7],celisa:filteredArray[j][8],judgement:filteredArray[j][9]}
        //             if(filteredArray[j][9]==="NEGATIVE"){
        //                 newObj.negative.push(o)
        //             }else if(filteredArray[j][9]==="POSITIVE"){
        //                 newObj.positive.push(o)
        //             }else{
        //                 newObj.suspect.push(o)
        //             }
        //         }
        //     }
        //   //console.log(allDocs)
    
    
        //   })
    }
    console.log(arrays)
  return (
    <div>
                    <div className="mt-4 mb-2" style={{textAlign:"center"}}>
                    <label htmlFor="contained-button-file">
                    <Input 
                    onChange={upload}

                    accept=".xlsx,.xls,.csv" id="contained-button-file"  type="file" />
                    <Button variant="contained" component="span" endIcon={<UploadFileIcon />}>
                    Upload Excel
                    </Button>
                    </label>
                    <h1>Old Hospital Data</h1>
                    <div className="m-2" style={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    rows={arrays}
                    columns={columns2}
                    autoPageSize
                    checkboxSelection
                    // onRowClick={(item,ev)=>props.history.push('/orderdetails',item.row)}
                />
            </div>

            <h1>Old Project Data</h1>
                    <div className="m-2" style={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    rows={arrays2}
                    columns={columns1}
                    autoPageSize
                    checkboxSelection
                    // onRowClick={(item,ev)=>props.history.push('/orderdetails',item.row)}
                />
            </div>
                    </div>
    </div>
  )
}
const columns1 = [
    { field: 'id', headerName: 'ID',width:20},
    //{ field: 'brand', headerName: 'Brand Name',valueGetter:(param)=>param.value.name,width:150},
    { field: 'reportNumber', headerName: 'ReportNumber',valueGetter:(param)=>param.row.reportNumber,width:150},
    { field: 'batch', headerName: 'batch',valueGetter:(param)=>param.row.batch,width:150},
    { field: 'microchip', headerName: 'microchip',valueGetter:(param)=>param.row.microchip,width:200},
    { field: 'neck', headerName: 'neck',valueGetter:(param)=>param.row.neck,width:150},
    { field: 'bullName', headerName: 'bullName',valueGetter:(param)=>param.row.bullName,width:150},
    { field: 'organization', headerName: 'organization',valueGetter:(param)=>param.row.organization,width:150},
    { field: 'judgement', headerName: 'judgement',valueGetter:(param)=>param.row.judgement,width:150},
    { field: 'bapat', headerName: 'bapat',valueGetter:(param)=>param.row.bapat,width:150},
    { field: 'bct', headerName: 'bct',valueGetter:(param)=>param.row.bct,width:150},
    { field: 'celisa', headerName: 'celisa',valueGetter:(param)=>param.row.celisa,width:150},
    {field:"date",headerName:"Created At",valueGetter:(param)=>moment.parseZone(param.value).local().format("DD/MM/YY"),width:120}


  ];
  const columns2 = [
    { field: 'id', headerName: 'ID',width:20},
    //{ field: 'brand', headerName: 'Brand Name',valueGetter:(param)=>param.value.name,width:150},
    { field: 'reportNumber', headerName: 'ReportNumber',valueGetter:(param)=>param.row.reportNumber,width:150},
    { field: 'batch', headerName: 'batch',valueGetter:(param)=>param.row.batch,width:150},
    { field: 'microchip', headerName: 'microchip',valueGetter:(param)=>param.row.microchip,width:200},
    { field: 'neck', headerName: 'neck',valueGetter:(param)=>param.row.neck,width:150},
    { field: 'judgement', headerName: 'judgement',valueGetter:(param)=>param.row.judgement,width:150},
    { field: 'bapat', headerName: 'bapat',valueGetter:(param)=>param.row.bapat,width:150},
    { field: 'bct', headerName: 'bct',valueGetter:(param)=>param.row.bct,width:150},
    { field: 'celisa', headerName: 'celisa',valueGetter:(param)=>param.row.celisa,width:150},
    {field:"date",headerName:"Created At",valueGetter:(param)=>moment.parseZone(param.value).local().format("DD/MM/YY"),width:120}


  ];
export default OldUploads