let columns,files,file_set;



// Input Screen Functions and Objects
file_set = new Set()
function fileRemove(el){
    let parentElement = el.parentElement;
    file_set.delete(parentElement.getElementsByClassName("file-name")[0].textContent);
    parentElement.remove();
    if (file_set.size=== 0){document.getElementsByClassName("footer-btn")[0].style.display = "none"};
}

function createFileName(file_name){
    if (!file_set.has(file_name)){
        const file_li = document.createElement("li");
        const file_name_div = document.createElement("file-name");
        const file_rm_btn = document.createElement("button");
        file_rm_btn.innerHTML = "Remove";
        file_rm_btn.setAttribute("onclick","fileRemove(this)");
        file_name_div.setAttribute("class","file-name");
        file_name_div.innerHTML = file_name;
        [file_name_div,file_rm_btn].forEach((el)=>{file_li.appendChild(el)})
        document.getElementsByClassName("file-list")[0].appendChild(file_li);
    };
    file_set.add(file_name)
}

async function getFiles() {
    let files = await eel.getFiles()();

    files.forEach((file)=>{ if (file.length !== 0){
        createFileName(file);
        document.getElementsByClassName("footer-btn")[0].style.display = "inline-block";
        }
    }
    );
}






// done with input screen