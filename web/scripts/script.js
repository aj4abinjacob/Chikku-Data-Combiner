
let columns,same_columns,unique_columns,files_returned,files_object;

// Global input output error check variables
let invalid_input_cols, invalid_output_cols, multiple_same_input_cols, invalid_cols_log;



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
function nth(n){return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th'}
function updateColumnHighlight(){
  invalid_cols_log = ''
  let user_input_values = []
  Array.from(document.getElementsByClassName("input-columns")).forEach((el) =>{
    el.value = el.value.replace(",,",",");
    el.value.split(",").forEach((col)=>{user_input_values.push(col)})})

  Array.from(unique_columns).forEach(el=>{
    if(user_input_values.includes(el)){
      if (user_input_values.reduce((t,c)=>(c === el ? t+1 : t ),0) > 1){
        $(`.col-btn:contains(${el})`).css("border","1px solid hsl(0, 100%, 50%)");  
        $(`.col-btn:contains(${el})`).css("color","hsl(0, 100%, 50%)");
        multiple_same_input_cols = true  
        invalid_cols_log += `You have entered ${el} more than once`
      }else{
        $(`.col-btn:contains(${el})`).css("border","1px solid #0aaa42");
        $(`.col-btn:contains(${el})`).css("color"," #0aaa42");
      }
      
    }else{
      $(`.col-btn:contains(${el})`).css("border","1px solid hsl(0, 0%, 52%)");  
      $(`.col-btn:contains(${el})`).css("color","white");
      multiple_same_input_cols = false  

    }
  })
  const difference = new Set([...user_input_values].filter((x) => !unique_columns.has(x)))
  // Check to see if user has entered wrong input value for input columns
  if (difference.size > 0) {
    invalid_output_cols = true;
    if (difference.has("")){
      invalid_cols_log += `\nYou have entered input columns with empty values`
    }else{
      invalid_cols_log += `\nYou have entered columns which are not in any files : ${Array.from(difference).join().replace(/^,+|,+$/g, '')}`
    }
  }else{
    invalid_output_cols = false;
  }
  // Check to see if user has entered wrong input value for input columns
  Array.from(document.getElementsByClassName("output-column")).forEach((el,ind)=>{
      if(el.value === ""){
        invalid_output_cols = true;
        invalid_cols_log += `\nYou haven't filled ${ind+1}${nth(ind+1)} output column`;
      }else{
        invalid_output_cols = false;
      }
    })

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



// Combine Files
async function combineFiles(){
  // final cleanup
  ["input-columns","output-column"].forEach((val)=>{
    Array.from(document.getElementsByClassName(val)).forEach((el) =>{
      el.value = el.value.replace(/^,+|,+$/g, '')
    })
  }
  )
  updateColumnHighlight();
  // check to see if there are any errors before combining
  if ((invalid_output_cols)||($(".input-columns").length === 0) || ($(".output-column").length ===0) || multiple_same_input_cols){
      alert(`Please give valid input before submiting. \n${invalid_cols_log}`);
  }else{
    // hide combine screen
    $("#combine-screen").hide();
    $("submit-btn").hide();
    // If no error proceed to combine
    document.getElementById("nav-btn").style.display = "none"; //temp hide
    col_python_dict_input = {}
    // get user entered values
    Array.from(document.getElementsByClassName("col-in-out-container")).forEach((el)=>{
      col_python_dict_input[el.getElementsByClassName("output-column")[0].value] = el.getElementsByClassName("input-columns")[0].value
    })
    let selected_files = Object.keys(files_object)
    for (let i = 0; i < selected_files.length; i++ ){  
      combine_status = await eel.combineFiles([selected_files[i],col_python_dict_input])();
      console.log(combine_status);
      }
    let final_output = await eel.finalCombine()();
    console.log(final_output);
    document.getElementById("nav-btn").style.display = "inline-block";
  }

}


// footer button
function nextProcess(el){
    if (el.textContent === 'Select Columns'){
        document.getElementById("all-columns-container").innerHTML = "";
        columnsUpdate();
        document.getElementById("nav-btn").style.display = "inline-block";
        document.getElementById("input-screen").style.display = "none";
        document.getElementById("combine-screen").style.display = "flex";
        // Add a single input out div
        if(document.getElementsByClassName("col-in-out-container").length === 0){addInputOutput()};
        // Add a single auto complete for existing input output div
        bigAutocomplete();
        

      // Adding all columns
      Array.from(unique_columns).sort().forEach((el)=>{
        let col_btn = document.createElement("button");
        col_btn.setAttribute("class","col-btn")
        col_btn.setAttribute("onmouseover","showColumnInfo(this)")
        col_btn.innerText = el
        $("#all-columns-container").append(col_btn);
        document.getElementById("submit-btn").innerHTML = "Combine Files"
      })


      } // if select columns end here
      else if (el.textContent === "Combine Files") {
        combineFiles();
      }
    }

// Go back
function goBack(){
  if($("#combine-screen").is(":visible")){
    $("#combine-screen").hide();
    $("#output-screen").hide();
    $("#input-screen").show();
    document.getElementById("submit-btn").innerHTML = "Select Columns"; 
    $("#nav-btn").hide();
  }else{
    $("#output-screen").hide();
    $("#combine-screen").show();
    $("#submit-btn").show();

  }
}