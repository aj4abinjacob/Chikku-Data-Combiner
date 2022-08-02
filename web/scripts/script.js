
let columns,same_columns,unique_columns,files_returned,files_object;



// Input Screen Functions and Objects
files_object = {}

function columnsUpdate(){
    columns = Object.values(files_object);
    // p for previous element , c for current, e for element
    same_columns = columns.reduce((p,c)=>p.filter(e => c.includes(e))); 
    unique_columns = new Set;
    columns.forEach(arr=>{arr.forEach(el=>unique_columns.add(el))})

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

function initiateCombinerScreen(same_columns,unique_columns){
}



// footer button

function nextProcess(el){
    if (el.textContent === 'Select Columns'){
        document.getElementById("input-screen").style.display = "none"
        document.getElementById("combine-screen").style.display = "flex";
        // Auto complete

        // Single Auto Complete
       $(".output-column").autocomplete({
        source: Array.from(unique_columns)
       })

      // Multi Auto Complete
       
       $( function() {
        var availableTags =  Array.from(unique_columns)
         
        function split( val ) {
          return val.split( /,\s*/ );
        }
        function extractLast( term ) {
          return split( term ).pop();
        }
     
        $( ".input-columns" )
          // don't navigate away from the field on tab when selecting an item
          .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
                $( this ).autocomplete( "instance" ).menu.active ) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
              // delegate back to autocomplete, but extract the last term
              response( $.ui.autocomplete.filter(
                availableTags, extractLast( request.term ) ) );
            },
            focus: function() {
              // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              var terms = split( this.value );
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the comma-and-space at the end
              terms.push( "" );
              this.value = terms.join( ", " );
              return false;
            }
          });
      } );


      } // if select columns end here
    }

   