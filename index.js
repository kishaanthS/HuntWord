let grids,hints,allWords=[],wordsByLength=[];
let start,direction,flag=0,solve,check;
let informationOfWords=[],data;
let trie_var,start_flag=1;
let btnselector = document.querySelector('button');
let onehint = document.getElementById("onehint");
let allhint = document.getElementById("allhint");
start=document.getElementById("start");
solve=document.getElementById("solve");
check=document.getElementById("check");
direction = ["row","col","diagonal"];
let pause=1;
let total_words;
let rules;
let point1,point2,point3,point4,heading;




function Node(value){
    this.value = value;
    this.children = {};
    let index = 0;
}

class Trie{
    constructor(){
        this.root = new Node(null);
    }

    insert(word,index){
        let current = this.root;
        for(let chr of word){
            if(current.children[chr] === undefined){
                current.children[chr]= new Node(chr);
            }
            current = current.children[chr];
        }
        current.index = index;
    }
    search(word){
        let current  = this.root;
        for(let chr of word){
            if(current.children[chr] === undefined){
                return 0;
            }
            current = current.children[chr];
        }
        return current.index;
    }

}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        },ms)
    })
}


onpaint=readfilecontents();


function formgrid(){
    grids = document.getElementById("grid");
    for(let i = 0 ; i < 12 ; i++){
        let grid = document.createElement("div");
        grid.id=i+"grid";
        grid.className="grid-row";
        for(let j = 0 ; j < 12 ; j++){
            let cell = document.createElement("button");
            cell.id=i+"btn"+j;
            cell.className="btns"; 
            cell.style.backgroundColor="rgb(128,128,128,.3)";
            cell.innerHTML = "-";
            grid.appendChild(cell);
        }
        grids.appendChild(grid);
    }
}

function formhint(){
    hints = document.getElementById("hints");
    hints.style.opacity="1";
    for(let i = 1 ; i <=10;i++){
        let btn = document.createElement("button");
        btn.id=i;
        btn.className="hintbtns"
        btn.textContent = "WORD "+i;
        hints.appendChild(btn);
    }
}


let item_index = 0;

document.addEventListener("click",function(e){
    if(start_flag==1){
        alert("Start the game to hunt ! ! !");
    }
})


start.addEventListener("click",function(){
    if(flag && start_flag){
        total_words=10;
        flag = 0;
        start_flag=0;
        fillgrid();
        let string="";
        let ids = [];
        let nr1;
        let nr2;
        let nc1;
        let nc2;
        let indicator="null";
        document.addEventListener("click",async function(e){
            if(!start_flag && !flag){    
                element  = e.target;
                if(element.tagName == "BUTTON" && element.className=="btns"){
                    if(ids.length==0) indicator="null";
                    if(element.id==ids[ids.length-1]) return;
                    ids.push(element.id);
                    if(ids.length==2){
                        let id1 = ids[0];
                        let id2 = ids[1];
                        let r1 = id1[0];
                        let r2 = id2[0];
                        let c1="",c2="";
                        if(!isNaN(id1[1])) r1+=id1[1];
                        if(!isNaN(id2[1])) r2+=id2[1];
                        if(!isNaN(id1[id1.length-2])) c1+=id1[id1.length-2];
                        c1+=id1[id1.length-1];
                        if(!isNaN(id2[id2.length-2])) c2+=id2[id2.length-2];
                        c2+=id2[id2.length-1];
                        nr1=parseInt(r1);
                        nr2=parseInt(r2);
                        nc1=parseInt(c1);
                        nc2=parseInt(c2);
                        if(nr2-nr1===1 && nc2-nc1===1){
                            indicator = "diagonal";
                        }
                        else if(nr2-nr1===1 && nc2-nc1===0){
                            indicator = "col";
                        }
                        else if(nc2-nc1===1 && nr2-nr1===0){
                            indicator = "row";
                        }
                        else indicator = "null";
                    }
                    else if(ids.length>2){
                        let id1 = ids[ids.length-2];
                        let id2 = ids[ids.length-1];
                        let r1 = id1[0];
                        let r2 = id2[0];
                        let c1="",c2="";
                        if(!isNaN(id1[1])) r1+=id1[1];
                        if(!isNaN(id2[1])) r2+=id2[1];
                        if(!isNaN(id1[id1.length-2])) c1+=id1[id1.length-2];
                        c1+=id1[id1.length-1];
                        if(!isNaN(id2[id2.length-2])) c2+=id2[id2.length-2];
                        c2+=id2[id2.length-1];
                        nr1=parseInt(r1);
                        nr2=parseInt(r2);
                        nc1=parseInt(c1);
                        nc2=parseInt(c2);
                        if(indicator=="diagonal"){
                            if(nr2-nr1!==1 || nc2-nc1!==1){
                                indicator="null";
                            }
                        }
                        else if(indicator=="row"){
                            if(nc2-nc1!==1 || nr2-nr1!==0){
                                indicator="null";
                            }
                        }
                        else if(indicator=="col"){
                            if(nr2-nr1!==1 || nc2-nc1!==0){
                                indicator="null";
                            }
                        }
                    }
                    let id = document.getElementById(element.id);
                    id.style.backgroundColor = "pink";
                    string+=element.innerHTML;
                }
                if(element.tagName == "BUTTON" && element.className=="hintbtns"){
                    if(informationOfWords[element.id-1].open==1){
                        onehint.style.opacity = "1";
                        onehint.textContent = "HINT : ";
                        onehint.style.textAlign="center";
                        onehint.textContent +=  informationOfWords[element.id-1].definition;
                    }
                    else{
                        alert("You have already solved the word");
                    }
                }
            }
        })
        check.addEventListener("click",async function(){
            if(!start_flag && !flag){
                let inTrieOrNot  = trie_var.search(string);
                string="";
                if(inTrieOrNot && indicator!=="null"){
                    if(informationOfWords[inTrieOrNot-1].open==0){
                        alert("Already found the word");
                        string="";
                        ids=[];
                        return;
                    }
                    let temp_flag=0;
                    for(let i = 0 ;i < ids.length; i++){
                        let temp = document.getElementById(ids[i]);
                        temp.style.backgroundColor="green";
                        temp_flag=1;
                    }
                    if(temp_flag) await sleep(1000);
                    temp_flag=0;
                    for(let i = 0 ;i < ids.length; i++){
                        let temp = document.getElementById(ids[i]);
                        temp.style.backgroundColor="rgb(128,128,128,.3)";
                    }
                    informationOfWords[inTrieOrNot-1].open=0;
                    onehint.style.opacity="0";
                    total_words--;
                    let id = document.getElementById(inTrieOrNot);
                    id.style.textDecoration="line-through";

                    if(total_words==0){
                        alert("You hunt is a 100% success ! ! ! ");
                        let val = confirm("Do you want to play again ? ");
                        if(val){
                            location.reload();
                        }
                        else{
                            let temp = document.createElement("p");
                            temp.innerHTML = "HINTS";
                            allhint.appendChild(temp);
                            for(let  i = 1 ; i <= 10; i++){
                                let id = document.getElementById(i);
                                let temp = document.createElement("div");
                                temp.innerHTML ="Word " + i + " : " + informationOfWords[i-1].definition;
                                allhint.appendChild(temp);
                            }
                            onehint.style.opacity = "0";
                            allhint.style.opacity="1";
                        }
                    }
                    ids=[];
                }
                else{
                    str="";
                    let temp_flag=0;
                    for(let i = 0 ;i < ids.length; i++){
                        let temp = document.getElementById(ids[i]);
                        temp.style.backgroundColor="red";
                        temp_flag=1;
                    }
                    if(temp_flag) await sleep(1000);
                    temp_flag=0;
                    for(let i = 0 ;i < ids.length; i++){
                        let temp = document.getElementById(ids[i]);
                        temp.style.backgroundColor="rgb(128,128,128,.3)";
                    }
                    ids=[];
                }
            }
        })
        solve.addEventListener("click",async function(){
            if(!start_flag){
                let colour=["green","red","darkgoldenrod","darkslategrey","darkorange","yellow","darkblue","lightsalmon","fuchsia","violet"];
                for(let i = 0 ; i < informationOfWords.length;i++){
                    if(informationOfWords[i].orientation=="row"){
                        for(let j = informationOfWords[i].col ; j < informationOfWords[i].word.length+informationOfWords[i].col ; j++){
                            let id = informationOfWords[i].row+"btn"+j;
                            let temp_id = document.getElementById(id);
                            temp_id.style.backgroundColor=colour[i];
                        }
                    }
                    else if(informationOfWords[i].orientation=="col"){
                        for(let j = informationOfWords[i].row ; j < informationOfWords[i].word.length+informationOfWords[i].row ; j++){
                            let id = j+"btn"+informationOfWords[i].col;
                            let temp_id = document.getElementById(id);
                            temp_id.style.backgroundColor=colour[i];

                        }
                    }
                    else if(informationOfWords[i].orientation=="diagonal"){
                        let r = informationOfWords[i].row;
                        let c = informationOfWords[i].col;
                        for(let j=0;j<informationOfWords[i].word.length;j++){
                            let id = r+"btn"+c;
                            let temp_id = document.getElementById(id);
                            temp_id.style.backgroundColor=colour[i];
                            r++;c++;
                        }
                    }
                }
                let temp = document.createElement("p");
                temp.innerHTML = "HINTS";
                allhint.appendChild(temp);
                for(let  i = 1 ; i <= 10; i++){
                    let id = document.getElementById(i);
                    let temp = document.createElement("div");
                    temp.innerHTML ="Word " + i + " : " + informationOfWords[i-1].definition;
                    allhint.appendChild(temp);
                }
                onehint.style.opacity = "0";
                allhint.style.opacity="1";
                total_words=0;
                flag=1;
                await sleep(5000);
                if(total_words==0){
                    let val = confirm("Do you want to play again ? ");
                    if(val){
                        location.reload();
                    }
                }
            }
        })
        
    }
})



function fillgrid(){
    for(let i = 0 ; i < informationOfWords.length;){
        while(true){
            let orientation = direction[Math.floor(Math.random()*direction.length)];
            let start = Math.floor(Math.random()*144);
            let row = Math.floor(start / 12);
            let col = start % 12;
            if(orientation === "row"){
                if(col + informationOfWords[i].word.length <= 11){
                    let fl = 0;
                    for(let j = col; j < informationOfWords[i].word.length+col; j++){
                        let temp_id  =  row + "btn"  + j;
                        let temp_cell = document.getElementById(temp_id);
                        if(j===12 || temp_cell.innerHTML !="-") {
                            fl = 1;
                            break;
                        }
                    }
                    if(!fl){
                        informationOfWords[i].col = col;
                        informationOfWords[i].row = row;
                        informationOfWords[i].orientation=orientation;
                        for(let j = col,k=0; k < informationOfWords[i].word.length ; j++){
                            let temp_id  =  row+"btn"+j;
                            let temp_cell = document.getElementById(temp_id);
                            temp_cell.textContent = informationOfWords[i].word[k++].toUpperCase();
                            temp_cell.style.color="black";
                        }
                        i++;
                        break;
                    }
                }

            }
            else if(orientation === "col"){
                if(row + informationOfWords[i].word.length <= 11){
                    let fl = 0;
                    for(let j = row; j < informationOfWords[i].word.length+row; j++){
                        let temp_id  =  j+"btn"+col;
                        let temp_cell = document.getElementById(temp_id);
                        if(j===12 || temp_cell.innerHTML !="-") {
                            fl = 1;
                            break;
                        }
                        
                    }
                    if(!fl){
                        informationOfWords[i].col = col;
                        informationOfWords[i].row = row;
                        informationOfWords[i].orientation=orientation;
                        informationOfWords[i].position=col+"/"+row;
                        for(let j = row,k=0; k < informationOfWords[i].word.length ; j++){
                            let temp_id  =  j + "btn"  + col;
                            let temp_cell = document.getElementById(temp_id);
                            temp_cell.textContent = informationOfWords[i].word[k++].toUpperCase(); 
                            temp_cell.style.color="black";
                        }
                        i++;
                        break;
                    }
                }
            }  
            else if(orientation === "diagonal"){
                let r = row,c=col;
                let fl=0;
                for(let j = 0 ; j < informationOfWords[i].word.length; j++){
                    let temp_id  =  r+"btn"+c;
                    let temp_cell = document.getElementById(temp_id);
                    if(r === 12 || c === 12 || temp_cell.innerHTML!="-"){
                        fl = 1;
                        break;
                    }
                    r++;c++;
                }
                if(!fl){
                    r = row,c=col;
                    informationOfWords[i].col = c;
                    informationOfWords[i].row = r;
                    informationOfWords[i].orientation=orientation;
                    for(let j = 0 ; j < informationOfWords[i].word.length ; j++){
                        let temp_id  =  r+"btn"+c;
                        let temp_cell = document.getElementById(temp_id);
                        temp_cell.textContent = informationOfWords[i].word[j].toUpperCase();
                        temp_cell.style.color="black";
                        r++;
                        c++;
                    }
                    i++;
                    break;
                }
            }
        }
    }
    for(let i = 0 ;i < 12 ; i++){
        for(let j = 0 ; j < 12 ; j++){
            let id = i+"btn"+j;
            let temp = document.getElementById(id);
            let ch = Math.floor(Math.random()*26);
            if(temp.innerHTML=="-"){
                temp.textContent = String.fromCharCode(ch+65);
                temp.style.color="black";

            }
        }
    }
}


function wordssplit(){
    for(let  i = 0 ; i <=6 ; i++){
        wordsByLength.push([]);
    }
    for(let i = 0 ; i<allWords.length; i++){
        if(allWords[i].length>=3 && allWords[i].length<=9) wordsByLength[allWords[i].length-3].push(allWords[i]);
    }
    wordgenerate();

}

function wordgenerate(){
    let idx = Math.floor(Math.random()*wordsByLength[item_index].length);
    getting_word_info(wordsByLength[item_index][idx]);
}



function checkpos(){
    for(let i = 0 ; i < data[0].meanings.length; i++){
        if(data[0].meanings[i].partOfSpeech === "noun"){
            if(!trie_var.search(data[0].word)) {
                trie_var.insert(data[0].word.toUpperCase(),informationOfWords.length+1);
                informationOfWords.push({"word" : data[0].word ,"pos" : data[0].meanings[i].partOfSpeech , "definition" : data[0].meanings[i].definitions[0].definition,"col" : -1,"row" : -1,"orientation" : "Null",open : 1});
                if(informationOfWords.length===1  || informationOfWords.length===3 || informationOfWords.length===5 || informationOfWords.length===7 || informationOfWords.length===9) item_index++;
                break;
            }
        }
    }
}

async function getting_word_info(word){  
    let temp = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word);
    data  = await temp.json();
    if(data[0].title === "No Definitions Found") wordgenerate();
    else{
        checkpos();
        if(informationOfWords.length<=9) wordgenerate();
        else{
            flag=1;
            return;
        }
    }
}   


function main(){
    formgrid();
    formhint();
    wordssplit();    
}


async function readfilecontents(){
    heading=document.getElementById("heading");
    point1=document.getElementById("point1");
    point2=document.getElementById("point2");
    point3=document.getElementById("point3");
    point4=document.getElementById("point4");
    heading.textContent="Rules and Regulations!!";
    point1.textContent="1. Word Hunt begins on click of the start button.You can click on the letters continuously one by one on the boxes to form the word.";
    point2.textContent="2.Words are arranged from left to rigth , top to bottom and diagonally (left to right)."
    point3.textContent="3. If you want the hint, click on any hint that you want . It opens if you have not yet found that word . Else open hint for another word.";
    point4.textContent="4. If you can't find it, click on the solve button and it means";
    trie_var = new Trie();
    let content = await fetch('https://raw.githubusercontent.com/kish2002/Projects/main/word.json');
    allWords = await content.json();
    main();
}










