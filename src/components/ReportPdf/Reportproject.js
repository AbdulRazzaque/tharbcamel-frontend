import React from 'react'
import "./ReportPdf.scss"

function Reportproject(props) {
    console.log(props)
    let details = props.location.state;
    React.useEffect(()=>{
        setTimeout(() => {
            window.print();            
        }, 1000);
    },[])
  return (
    <div className="report-pdf-2">
        <section className="row m-auto container-first align-items-center">
            <div className="col-4 cont-1">
            <img src="/tharblogowp.jpeg" alt="tharb" />
            </div>
            <div className="col-4 cont-2">
                <h2>تقرير فحص عينات</h2>
            </div>
            <div className="col-4 cont-3">
                <h3>مختبر مستشفى ذرب للهجن</h3>
            </div>
        </section>
        <section className="report-number-parent">
            <div className="report-number-child row m-auto align-items-center ">
                <div className="col-5 value ">
                    <p>{details.reportNumber}</p>
                </div>
                <div className="col-4 key ">
                    <p>
                    تقرير رقم
                    </p>
                </div>
            </div>

            <div className="report-number-child row m-auto align-items-center ">
                <div className="col-5 value">
                    <p>{details.workOrder}</p>
                </div>
                <div className="col-4 key">
                    <p className='tashgili'>  الرقم التشغيلي</p>
                </div>
            </div>

            <div className="report-number-child row m-auto align-items-center">
                <div className="col-5 value">
                    <p>{details.mainDate}</p>
                </div>
                <div className="col-4 key">
                    <p>
                    تاريخ الردود
                    </p>
                </div>
            </div>
        </section>
        <section className="third container-second">
        <div className="row m-auto justify-content-end">
                <div className="mr-2">
                    <p className="bold-text"><span> {details.ownerName}</span> </p>
                </div>
                <div>
                    <p className="bold-text"><span> //السيد</span> </p>
                </div>
            </div>
        <p>
                 <span className="">بفحص العينات الواردة الى معمل مستشفى ذرب للهجن بتاريخ</span>
                 <span className="bold-text mx-2">{details.mainDate}</span>
                 <span className="">و بياناتها كالتالى</span>
             </p>
        <div className="row m-auto justify-content-end">
                <div className="col-5 key colfive">
                    <p>دم:</p>
                    <p className="bold-text">{details.sampleQuantity}:</p>
                    <p>الكشف عن اجسام مناعية للبروسيل:</p>
                    <p>الميكروبيولوجى:</p>
                </div>
                <div className="col-3 value">
                    <p className="bold-text">نوع العينات</p>
                    <p className="bold-text">عدد العینات</p>
                    <p className="bold-text">الفحص المطلوب</p>
                    <p className="bold-text">جهة الفحص</p>
                </div>
             </div>
             </section>

        <section className="container-fourth">
        <h1>نتائج الفحص</h1>
        <div className="row  mx-auto justify-content-center">
            <div className="col-2 heading">              
                <h2>السلبى</h2>
            </div>
            <div className="col-2 heading">
                <h2>المشتبه</h2>
            </div>
            <div className="col-2 heading">
                <h2>الايجابى</h2>
            </div>
            <div className="col-2 heading">
                <h2>بدون دم</h2>
            </div>
            <div className="col-2 heading">
                <h2>العدد الاجمالى</h2>
            </div>
        </div>
        <div className="row m-auto justify-content-center row2">
            <div className="col-2 heading-value">
                <h2>{details.negative.length}</h2>              
            </div>
            <div className="col-2 heading-value">
            <h2>{details.suspect.length}</h2>
            </div>
            <div className="col-2 heading-value">
            <h2>{details.positive.length}</h2>
            </div>
            <div className="col-2 heading-value">
            <h2>{details.noBlood.length}</h2>
            </div>
            <div className="col-2 heading-value">
            <h2>{details.negative.length+details.suspect.length+details.positive.length+details.noBlood.length}</h2>
            </div>
        </div>
        </section>

        <h1 className='tfasil' style={{textAlign:"center"}}>تفاصيل الاختبار</h1>

        {details.negative.length>0&&<>
       <h2 className="right">NEGATIVE السلبى /<span style={{background:"green",textDecoration:'underline',textUnderlineOffset:'8px'}}>لم تظهر إصابة بالمرض</span></h2>
        {/* <table className="table dark-border"> */}
        <table className="ui celled table dark-border">
        <thead >
            <tr><th className="dark-border" >م</th>
            <th className="dark-border" >رقم الرقبة</th>
            <th className="dark-border" >رقم المالك</th>
            <th className="dark-border" >رقم الشريحة</th>
            <th className="dark-border" >اسم الفحل</th>
            {details.negative[0].bapat.length>0&&<th className="dark-border">BAPAT</th>}
             {details.negative[0].bct.length>0&&<th className="dark-border">BCT</th>}
             {details.negative[0].celisa.length>0&&<th className="dark-border">cElisa</th>}
            <th className="dark-border">النتيجة</th>
        </tr></thead>
        <tbody>
        {
         details.negative.map((item,index)=><tr >
         <td className="dark-border"  data-label="Name">{index+1}</td>
         <td className="dark-border"  data-label="Job">{item.neck}</td>
         <td className="dark-border" >{item.rakumalmalik}</td>
         <td className="dark-border"  data-label="Age">{item.microchip}</td>
         <td className="dark-border"  data-label="Job">{item.bullname}</td>
         {details.negative[0].bapat.length>0&&<td className="dark-border" data-label="Job">{item.bapat.toUpperCase()}</td>}
          {details.negative[0].bct.length>0&&<td className="dark-border" data-label="Job">{item.bct.toUpperCase()}</td>}
          {details.negative[0].celisa.length>0&&<td className="dark-border" data-label="Job">{item.celisa.toUpperCase()}</td>}
         <td className="dark-border negative1"  data-label="Job"> <b>{item.judgement.toUpperCase()}</b></td>
         </tr>)   
        }
        </tbody>
        </table>
        </>}

        {details.positive.length>0&&<>
        {/* <h2 className="right">POSITIVE: الايجابى</h2> */}
       <h2 className="right">POSITIVE الايجابى /<span style={{background:"red",textDecoration:'underline',textUnderlineOffset:'8px'}}>مصاب بالمرض</span></h2>

        <table className="ui celled table dark-border">
        <thead>
            <tr><th className="dark-border">م</th>
            <th className="dark-border">رقم الرقبة</th>
            <th className="dark-border">رقم المالك</th>
            <th className="dark-border">رقم الشريحة</th>
            <th className="dark-border">اسم الفحل</th>
            {details.positive[0].bapat.length>0&&<th className="dark-border">BAPAT</th>}
             {details.positive[0].bct.length>0&&<th className="dark-border">BCT</th>}
             {details.positive[0].celisa.length>0&&<th className="dark-border">cElisa</th>}
            <th className="dark-border">النتيجة</th>
        </tr></thead>
        <tbody>
        {
         details.positive.map((item,index)=><tr>
         <td className="dark-border"  data-label="Name">{index+1}</td>
         <td className="dark-border"  data-label="Job">{item.neck}</td>
         <td className="dark-border" >{item.rakumalmalik}</td>
         <td className="dark-border"  data-label="Age">{item.microchip}</td>
         <td className="dark-border"  data-label="Job">{item.bullname}</td>
         {details.positive[0].bapat.length>0&&<td className="dark-border" data-label="Job">{item.bapat.toUpperCase()}</td>}
          {details.positive[0].bct.length>0&&<td className="dark-border" data-label="Job">{item.bct.toUpperCase()}</td>}
          {details.positive[0].celisa.length>0&&<td className="dark-border" data-label="Job">{item.celisa.toUpperCase()}</td>}
         <td className="dark-border positive1"  data-label="Job"><b>{item.judgement.toUpperCase()}</b> </td>
         </tr>)   
        }
        </tbody>
        </table>
        </>}


        {details.suspect.length>0&&<>
        {/* <h2 className="right">SUSPECT: المشتبه</h2> */}
       <h2 className="right">SUSPECT المشتبه /<span style={{background:"orange",textDecoration:'underline',textUnderlineOffset:'8px'}}> إصابة محتملة بالمرض</span></h2>

        <table className="ui celled table dark-border">
        <thead>
            <tr><th className="dark-border">م</th>
            <th className="dark-border">رقم الرقبة</th>
            <th className="dark-border">رقم المالك</th>
            <th className="dark-border">رقم الشريحة</th>
            <th className="dark-border">اسم الفحل</th>
            {details.suspect[0].bapat.length>0&&<th className="dark-border">BAPAT</th>}
             {details.suspect[0].bct.length>0&&<th className="dark-border">BCT</th>}
             {details.suspect[0].celisa.length>0&&<th className="dark-border">cElisa</th>}
            <th className="dark-border">النتيجة</th>
        </tr></thead>
        <tbody>
        {
         details.suspect.map((item,index)=><tr>
         <td className="dark-border"  data-label="Name">{index+1}</td>
         <td className="dark-border"  data-label="Job">{item.neck}</td>
         <td className="dark-border">{item.rakumalmalik}</td>
         <td className="dark-border"  data-label="Age">{item.microchip}</td>
         <td className="dark-border"  data-label="Job">{item.bullname}</td>
         {details.suspect[0].bapat.length>0&&<td className="dark-border" data-label="Job">{item.bapat.toUpperCase()}</td>}
          {details.suspect[0].bct.length>0&&<td className="dark-border" data-label="Job">{item.bct.toUpperCase()}</td>}
          {details.suspect[0].celisa.length>0&&<td className="dark-border" data-label="Job">{item.celisa.toUpperCase()}</td>}
         <td className="dark-border suspect"  data-label="Job"><b> {item.judgement.toUpperCase()}</b></td>
         </tr>)   
        }
        </tbody>
        </table>
        </>}
        {details.noBlood.length>0&&<>
         <h3 className="right">No Blood :بدون دم</h3>
         <table className="ui celled table dark-border">
         <thead>
             <tr><th className="dark-border">م</th>
             <th className="dark-border">رقم الرقبة</th>
             <th className="dark-border">رقم المالك</th>
             <th className="dark-border">رقم الشريحة</th>
             <th className="dark-border">اسم الفحل</th>
             
             <th className="dark-border">Name</th>
             {details.noBlood[0].bapat.length>0&&<th className="dark-border">BAPAT</th>}
             {details.noBlood[0].bct.length>0&&<th className="dark-border">BCT</th>}
             {details.noBlood[0].celisa.length>0&&<th className="dark-border">cElisa</th>}
             <th className="dark-border">JUDGEMENT</th>
         </tr></thead>
         <tbody>
         {
          details.noBlood.map((item,index)=><tr>
          <td className="dark-border" data-label="Name">{index+1}</td>
          <td className="dark-border" data-label="Job">{item.neck}</td>
          <td className="dark-border">{item.rakumalmalik}</td>
          <td className="dark-border" data-label="Age">{item.microchip}</td>
          <td className="dark-border"  data-label="Job">{item.bullname}</td>
          <td className="dark-border" data-label="Job"></td>
          {details.noBlood[0].bapat.length>0&&<td className="dark-border" data-label="Job">{item.bapat.toUpperCase()}</td>}
          {details.noBlood[0].bct.length>0&&<td className="dark-border" data-label="Job">{item.bct.toUpperCase()}</td>}
          {details.noBlood[0].celisa.length>0&&<td className="dark-border" data-label="Job">{item.celisa.toUpperCase()}</td>}
          <td className="dark-border" data-label="Job">{item.judgement.toUpperCase()}</td>
          </tr>)   
         }
         </tbody>
         </table>
         </>}
        <section className="container-sixth">
        <p className='note'> Note:- cELISA Mean Optical density &gt;  30 "POSITIVE" &lt; 30 "NEGATIVE"</p>
            <p>OIE manual of terrestrial animals 2016 طرق الاختبار -</p>
            <p>­ إسناد القیاس: إسناد القیاس طبقا للنظام الدولي لوحدات القیاس باستخدام المعایرات والمواد المرجعیة
            </p>
            <p>الظروف البیئیة: درجه الحراره22± 2درجه مئویة -</p>
            <div className="large-cont">
                <h2>:ملاحظات</h2>
            </div>
            <h3>المدير الفنى</h3>
            <p> الفحوص المدونة خاصة بالعينات الواردة فقط وتم سحبها بمعرفة العميل و بياناتها علي مسئولية الجهة الراسلة للعينات -</p>
            <p>لن يتم أعاده إصدار ھذا التقرير الاكاملا وبطلب مكتوب بواسطة العميل -</p>
            <p>إي كشط اوتغيير في التقرير يعتبر لاغي وأي صورة غير معتمدة من المعمل لا يعتد بها -</p>
            <p>
                <span>تحریرا في</span>
                <span className="mx-3 mainDate"> : {details.mainDate}</span>
                <span > بواسطة</span>
                <span className='bewasati'></span>
                <span className='Mudir'>مدير المختبر</span>
                
            </p>
         </section>
    </div>
  )
}

export default Reportproject;