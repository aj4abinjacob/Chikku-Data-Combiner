let columns,same_columns,unique_columns,files_returned,files_object;



// Input Screen Functions and Objects
files_object = {}

function columnsUpdate(){
    columns = Object.values(files_object);
    // p for previous element , c for current, e for element
    same_columns = columns.reduce((p,c)=>p.filter(e => c.includes(e))); 
    unique_columns = columns.reduce((p,c)=>c.filter(e => !p.includes(e)))
}


function fileRemove(el){
    let parent_element = el.parentElement;
    delete files_object[parent_element.getElementsByClassName("file-name")[0].textContent];
    if ( Object.keys(files_object).length !== 0) {columnsUpdate();}
    parent_element.remove();
    if (Object.keys(files_object).length === 0){document.getElementsByClassName("footer-btn")[0].style.display = "none"};
}

function createFileName(file_name,cols){
    if (!Object.keys(files_object).includes(file_name)){
        const file_li = document.createElement("li");
        const file_name_div = document.createElement("file-name");
        const file_rm_btn = document.createElement("button");
        file_rm_btn.innerHTML = "Remove";
        file_rm_btn.setAttribute("onclick","fileRemove(this)");
        file_rm_btn.setAttribute("class","remove-btn")
        file_name_div.setAttribute("class","file-name");
        file_name_div.innerHTML = file_name;
        [file_name_div,file_rm_btn].forEach((el)=>{file_li.appendChild(el)})
        document.getElementsByClassName("file-list")[0].appendChild(file_li);
    };
    files_object[file_name] = cols;
    columnsUpdate();
    
    console.log("unique",unique_columns);
    console.log("same",same_columns);
}

async function getFiles() {
    files_returned = await eel.getFiles()();
    Object.keys(files_returned).forEach((file)=>{ if (file.length !== 0){
        createFileName(file,files_returned[file]);
        document.getElementsByClassName("footer-btn")[0].style.display = "inline-block";
        }
       }
    );
}

// done with input screen