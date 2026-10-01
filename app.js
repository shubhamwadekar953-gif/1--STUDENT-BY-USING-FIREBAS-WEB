const stdForm = document.getElementById("stdForm")
const table = document.getElementById("stdList")
const fname = document.getElementById("fname")
const lname = document.getElementById("lname")
const email = document.getElementById("email")
const contact = document.getElementById("contact")
const addbtn = document.getElementById("submitBtn")
const updatebtn = document.getElementById("updateBtn")
const spinner = document.getElementById("spinner")

const BASE_URL = "https://student-crud-26d0f-default-rtdb.firebaseio.com/";
const STUDENT_URL = `${BASE_URL}/students.json`;


function hidespinner() {
    spinner.classList.add("d-none")
}

function showspinner() {
    spinner.classList.remove("d-none")
}


//read-student
let xhr = new XMLHttpRequest();
xhr.open("GET", STUDENT_URL)
xhr.send(null)
xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    let result = ``;

    for (let key in data) {
        let student = data[key];
        result += `
            <tr id="${key}">
                <td>${student.fname}</td>
                <td>${student.lname}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary"> Edit </button>
                </td>
                <td>
                    <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger"> Delete </button>
                </td>
            </tr>
        `;
    }
    table.innerHTML = result;
}


//create-student
function onCreate(eve){
    showspinner()
    eve.preventDefault();

    const stdObj ={
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", STUDENT_URL)
    xhr.send(JSON.stringify(stdObj));

    xhr.onload = () => {
        let res = JSON.parse(xhr.response)

        if(xhr.status >= 200 && xhr.status <= 299){
            let createtr = document.createElement("tr")
            createtr.id = res.name
            createtr.innerHTML = `
                        <td>${stdObj.fname}</td>
                        <td>${stdObj.lname}</td>
                        <td>${stdObj.email}</td>
                        <td>${stdObj.contact}</td>
                        <td><button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button></td>
                        <td><button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">Delete</button></td>
                        `
        
        table.prepend(createtr)
        stdForm.reset()

        Swal.fire({
            text:"Your Student form created successfully !!!",
            icon:"success",
            timer:2000
        })
    }else{
        console.log(`something went wrong while get data !!!`)
    } 
    hidespinner()
  }
}


//edit-student
function onEdit(ele){
    showspinner();

    let EDIT_ID = ele.closest('tr').id;
    let EDIT_URL = `${BASE_URL}/students/${EDIT_ID}.json`;
    localStorage.setItem('EDIT_ID', EDIT_ID);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            fname.value = res.fname;
            lname.value = res.lname;
            email.value = res.email;
            contact.value = res.contact;

            addbtn.classList.add('d-none');
            updatebtn.classList.remove('d-none');

            Swal.fire({
              title: "Now, You Can Edit Student Data",
              icon: "info",
              timer: 1500,
              showConfirmButton: false
            });
        }
        hidespinner();
    }
}


//update-student
function onUpdate(){
    showspinner();

    let update_Id = localStorage.getItem('EDIT_ID');
    let UPDATE_URL = `${BASE_URL}/students/${update_Id}.json`;

    let updateObj={
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value
    };

    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL);
    xhr.send(JSON.stringify(updateObj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            let tr = document.getElementById(update_Id);
            tr.children[0].innerHTML = res.fname;
            tr.children[1].innerHTML = res.lname;
            tr.children[2].innerHTML = res.email;
            tr.children[3].innerHTML = res.contact;

            stdForm.reset();
            addbtn.classList.remove('d-none');
            updatebtn.classList.add('d-none');
            localStorage.removeItem('EDIT_ID');

            Swal.fire({
              title: "Student Form Updated successfully!",
              icon: "success",
              timer:1500
            });
        }
        hidespinner();
    }
}



//delete-student
function onDelete(ele){
    let DELETE_ID = ele.closest('tr').id;

     Swal.fire({
        title: `Are you sure, you want to Delete Student Formwith id ${DELETE_ID}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed){

            showspinner()
            
            let DELETE_URL = `${BASE_URL}/students/${DELETE_ID}.json`;

            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", DELETE_URL);
            xhr.send(null);

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299){
                let res = JSON.parse(xhr.response);
                ele.closest('tr').remove();
                
                Swal.fire({
                    text: `Your Student Form with id ${DELETE_ID} is Deleted successfully !!!`,
                    icon:"success",
                    timer:2000
                })

            }else {
                console.log("Something went wrong while deleting !!!");
            }
            hidespinner()
            }
                xhr.onerror = function (){
                    hidespinner()
                 }
        }
    })
}



stdForm.addEventListener("submit", onCreate);
updatebtn.addEventListener('click', onUpdate);