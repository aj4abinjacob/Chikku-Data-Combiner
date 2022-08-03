
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

function updateColumnHighlight(){
  let user_input_values = []
  Array.from(document.getElementsByClassName("input-columns")).forEach((el) =>{
    el.value.split(",").forEach((col)=>{user_input_values.push(col)})})
  Array.from(unique_columns).forEach(el=>{
    if(user_input_values.includes(el)){
      if (user_input_values.reduce((t,c)=>(c === el ? t+1 : t ),0) > 1){
        $(`.col-btn:contains(${el})`).css("border","1px solid hsl(0, 100%, 50%)");  
      }else{
        $(`.col-btn:contains(${el})`).css("border","1px solid #0aaa42");
      }

    }else{
      $(`.col-btn:contains(${el})`).css("border","1px solid hsl(0, 0%, 52%)");  
    }
  })
  const difference = new Set([...user_input_values].filter((x) => !unique_columns.has(x)))
  if (difference.size > 0) {console.log(Array.from(difference).join().replace(/^,+|,+$/g, ''))} 
  
}


function addInputOutput(){
  let inp_out_div = document.createElement("div");
  inp_out_div.setAttribute("class","col-in-out-container");
  let output_column = document.createElement("input");
  output_column.setAttribute("class","output-column")
  output_column.setAttribute("placeholder","Output Column")
  let input_columns = document.createElement("input");
  input_columns.setAttribute("class","input-columns");
  input_columns.setAttribute("placeholder","Input Columns");
  input_columns.setAttribute("onkeydown","updateColumnHighlight()")
  let rem_btn = document.createElement("button");
  rem_btn.innerHTML = "Remove";
  rem_btn.setAttribute("class","col-inp-rm-btn");
  rem_btn.setAttribute("onclick","removeInpOut(this)")
  inp_out_div.appendChild(output_column);
  inp_out_div.appendChild(input_columns);
  inp_out_div.appendChild(rem_btn);
  $(inp_out_div).insertBefore("#col-add-btn-container")
  bigAutocomplete();
  $("#col-add-btn-container")[0].scrollIntoView({
    behavior: "smooth", // or "auto" or "instant"
    block: "start" // or "end"
});
}

function removeInpOut(el){
  el.parentElement.remove();
}

function bigAutocomplete(){
    // Auto complete
        // Single Auto Complete for output column
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
                this.value = terms.join( "," );
                return false;
              }
            });
        } );
        // Auto complete ends here
}

// Show column info on button click

function showColumnInfo(el){
  let column_containing_files = new Set 
  Object.keys(files_object).forEach((file)=>{if (files_object[file].includes(el.textContent)){column_containing_files.add(file)}})
  let ol_file = "<ol>"
  column_containing_files.forEach((el)=>{ol_file += `<li>${el}</li>`})
  ol_file += "</ol>"
  document.getElementById("column-info").innerHTML = `<h2>Column Info</h2><h3>${el.textContent}</h3>${ol_file}`;
}


// footer button
function nextProcess(el){
    if (el.textContent === 'Select Columns'){
        document.getElementById("input-screen").style.display = "none"
        document.getElementById("combine-screen").style.display = "flex";
        // Add a single input out div
        addInputOutput();
        // Add a single auto complete for existing input output div
        bigAutocomplete();


      // Adding all columns
      Array.from(unique_columns).sort().forEach((el)=>{
        let col_btn = document.createElement("button");
        col_btn.setAttribute("class","col-btn")
        col_btn.setAttribute("onclick","showColumnInfo(this)")
        col_btn.innerText = el
        $("#all-columns-container").append(col_btn);
      })
        $("#footer-btn").html("Combine Files")
        $("#footer-btn").style("cursor","pointer")


      } // if select columns end here
    }
