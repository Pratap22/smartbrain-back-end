
function callBack(num, onSuccess, onFail){

    if(num%2==0){
        setTimeout(()=>onSuccess(num + " even"),2000)
    }else{
        setTimeout(()=>onFail( num + " fail"),3000)
    }
}

callBack(4,(res)=>{
    console.log(res)
    callBack(5,console.log,console.error)
},console.error)