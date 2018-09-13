
async function promiceReduce(promiseList, reducer, initialValue){
    const length = promiseList.length;
    for(let i=0; i<length; i++){
        console.log( await promiseList[i]());
    }
}

const fn1 = () => Promise.resolve(1)


const fn2 = () => new Promise(resolve => {
  setTimeout(()=> resolve(2), 500)  
})
promiceReduce([fn1, fn2]);