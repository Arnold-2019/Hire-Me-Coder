(function() {


    // Web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyD8s6-0LuLSfNT2Qb80o4icD8ES1pOSR08",
        authDomain: "hireme-coder.firebaseapp.com",
        databaseURL: "https://hireme-coder.firebaseio.com",
        projectId: "hireme-coder",
        storageBucket: "hireme-coder.appspot.com",
        messagingSenderId: "705493928337",
        appId: "1:705493928337:web:e3bd0ceff64cbc5d"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    
    var question_id_array =[];
    var question_name_array =[];
    var description_array=[];
    // var photoUrl_array=[];
    
    
    //create element and render question
    function renderQuestions(doc, tbodyid, type){    
        // const thisQuestions = document.querySelector(string);
        let tr = document.createElement('tr');
        // let select = document.createElement('td');
        // let checkBox = document.createElement('input');
        let add_question = document.createElement('button');
        let add = document.createElement('td');
        let question_name = document.createElement('td');
        let description = document.createElement('td');
        


        tr.setAttribute('data-id',doc.id);
        // checkBox.type = "checkbox";
        add_question.textContent = "Add";
        question_name.textContent = doc.data().name;
        description.textContent = doc.data().description;

        function open_question(){
            let question_name = document.createElement('p');
            question_name.textContent = doc.data().name;
            nick_modal_content.appendChild(question_name);

            let question_description = document.createElement('p');
            question_description.textContent = doc.data().description;
            nick_modal_content.appendChild(question_description);
            nick_modal.style.padding="45rem 20rem";
            nick_modal.style.display="block";
        }
        question_name.addEventListener("click", (e)=> {
            e.preventDefault();
            open_question();
        })
        description.addEventListener("click", (e)=> {
            e.preventDefault();
            open_question();
        })
      

        // select.appendChild(checkBox);
        // tr.appendChild(select);
        add.appendChild(add_question);
        
        tr.appendChild(question_name);
        tr.appendChild(description);
        tr.appendChild(add);
              
        tbodyid.appendChild(tr);


        

        add_question.addEventListener("click", (e)=>{
            e.preventDefault();
            if(!question_id_array.includes(doc.id)){
                question_id_array.push(doc.id);
                question_name_array.push(doc.data().name);
                description_array.push(doc.data().description);
                
                let tr2 = document.createElement('tr');
                let selected_question_type = document.createElement('td');
                let selected_question_name = document.createElement('td');
                let remove = document.createElement('td');
                let removebtn = document.createElement('button');
                tr2.id = doc.id;
                
                selected_question_type.textContent = type;
                selected_question_name.textContent = doc.data().name;
                removebtn.textContent = "remove";

                remove.appendChild(removebtn);
                tr2.appendChild(selected_question_type);
                tr2.appendChild(selected_question_name);
                tr2.appendChild(remove);
                    
                questions_selected.appendChild(tr2);
                // function open_selected_question(){
                    
                // }
                selected_question_name.addEventListener("click",(e)=>{
                    e.preventDefault();
                    let question_name = document.createElement('p');
                    question_name.textContent = doc.data().name;
                    nick_modal_content.appendChild(question_name);

                    let question_description = document.createElement('p');
                    question_description.textContent = doc.data().description;
                    nick_modal_content.appendChild(question_description);
                    nick_modal.style.padding="10rem 20rem";
                    nick_modal.style.display="block";
                })
                selected_question_type.addEventListener("click",(e)=>{
                    e.preventDefault();
                    let question_name = document.createElement('p');
                    question_name.textContent = doc.data().name;
                    nick_modal_content.appendChild(question_name);

                    let question_description = document.createElement('p');
                    question_description.textContent = doc.data().description;
                    nick_modal_content.appendChild(question_description);
                    nick_modal.style.padding="10rem 20rem";
                    nick_modal.style.display="block";
                })

                removebtn.addEventListener("click", (e)=>{
                    e.preventDefault();
                    $("#questions_selected tr#"+doc.id).remove();
                    question_name_array.splice(question_id_array.indexOf(doc.id),1);
                    description_array.splice(question_id_array.indexOf(doc.id),1);
                    question_id_array.splice(question_id_array.indexOf(doc.id),1);
                })
            }
        })


        



        // checkBox.addEventListener("change", (e)=>{
        //     if(checkBox.checked){
        //         question_id_array.push(doc.id);
        //         question_name_array.push(doc.data().name);
        //         description_array.push(doc.data().description);
        //         // photoUrl_array.push(doc.data().photoUrl);
        //     }
        //     else{
        //         if(question_id_array.includes(doc.id)){
        //             question_id_array.splice(question_id_array.indexOf(doc.id),1);
        //         }
        //     }
        // })
    }


    db.collection('descriptive_questions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc,descriptiveQuestions,"Descriptive");
        })
        return 1;
    }).catch(error => { console.log('error') });

    db.collection('code_questions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc,codingQuestions,"Code");
        })
        return 1;
    }).catch(error => { console.log('error') });
    
    
    var createTest = document.getElementById('createTest');
    var test_name = document.getElementById('test_name');
    var created_by = document.getElementById('created_by');
    var test_description = document.getElementById('test_description');
    // createTest.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     db.collection('tests').add({
    //         test_name: test_name.value,
    //         create_time: firebase.firestore.Timestamp.fromDate(new Date()),
    //         questions_id: questions_id_array
    //     });
    //     location.href='/test/create-test';
    // })

    function errorPrint(){
        if (test_name.value === ""){
            document.getElementById('name_error').style.display="block";
        }
        else {
            document.getElementById('name_error').style.display="none";
        }
        if (created_by.value === ""){
            document.getElementById('created_by_error').style.display="block";
        } 
        else {
            document.getElementById('created_by_error').style.display="none";
        }
        if (test_description.value === ""){
            document.getElementById('test_description_error').style.display="block";
        }
        else {
            document.getElementById('test_description_error').style.display="none";
        }
    }

    createTest.addEventListener('click',(e)=>{
        e.preventDefault();
        
        
        if (test_name.value === "" || created_by.value === "" || test_description.value === "") {
            errorPrint();
        }
        else{
            db.collection('tests').add({
                test_name: test_name.value,
                created_on: firebase.firestore.Timestamp.fromDate(new Date()),
                created_by: created_by.value,
                test_description: test_description.value,
                question_name: question_name_array,
                question_description: description_array
            });
            document.getElementById('name_error').style.display="none";
            document.getElementById('created_by_error').style.display="none";
            document.getElementById('test_description_error').style.display="none";
            document.getElementById('create_success').style.display="block";



            let success_message = document.createElement('p');
            let redirect_message = document.createElement('p');

            success_message.textContent="Create " +test_name.value+" complete!";
            redirect_message.textContent="Redirecting to the manage tests page";

            nick_modal_content.appendChild(success_message);
            nick_modal_content.appendChild(redirect_message);
            nick_modal.style.display="block";
            nick_modal.style.padding="10rem 20rem";


            location.href='/test/manage-test';
        }


        // var storageRef = firebase.storage().ref('tests/'+ test_name.value+ '.pdf');
        // storageRef.put(doc);
        
    })

    var preview = document.getElementById('preview_test');
    preview.addEventListener("click", (e)=>{
        if (test_name.value === "" || created_by.value === "" || test_description.value === "") {
            errorPrint();
        }
        else {
            let test_name2 = document.createElement('p');
            test_name2.textContent = test_name.value;
            nick_modal_content.appendChild(test_name2);

            // console.log(question_id_array);
            for (i=0;i<question_id_array.length;i++){
                let id = question_id_array[i];
                let number = document.createElement('p');
                number.textContent = "Question " + (i+1);
                nick_modal_content.appendChild(number);

                let question_name = document.createElement('p');
                question_name.textContent = question_name_array[i];
                nick_modal_content.appendChild(question_name);

                let question_description = document.createElement('p');
                question_description.textContent = description_array[i];
                nick_modal_content.appendChild(question_description);
            }

            nick_modal.style.display="block";
            nick_modal.style.padding="10rem 20rem";

            document.getElementById('name_error').style.display="none";
            document.getElementById('created_by_error').style.display="none";
            document.getElementById('test_description_error').style.display="none";
        }
        
        
    })

    var close_view = document.getElementById('close_view');
    close_view.addEventListener("click",(e)=>{
        e.stopPropagation();
        $("#nick_modal_content p").remove();
        nick_modal.style.display="none";
        // $("#tests_content p").remove();
        // tests_content_modal.style.display="none";
    })


    var optionDescriptive = document.getElementById("optionDescriptive");
    var optionCode = document.getElementById("optionCode");
    var desciptive_table = document.getElementById("desciptive_table");
    var code_table = document.getElementById("code_table");
    optionDescriptive.addEventListener("click",(e)=>{
        e.stopPropagation();
        if (desciptive_table.style.display==="none"){
            desciptive_table.style.display="block";
            code_table.style.display="none";
            optionDescriptive.style.color="green";
            optionCode.style.color="black";
            optionDescriptive.classList.add("active");
            optionCode.classList.remove("active");
        }
    })
    optionCode.addEventListener("click",(e)=>{
        e.stopPropagation();
        if (desciptive_table.style.display==="block"){
            desciptive_table.style.display="none";
            code_table.style.display="block";
            optionDescriptive.style.color="black";
            optionCode.style.color="green";
            optionDescriptive.classList.remove("active");
            optionCode.classList.add("active");
        }
    })

    
}());


