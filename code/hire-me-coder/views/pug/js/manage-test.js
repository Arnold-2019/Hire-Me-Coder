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
    var question_type_array=[];


    var selected_tests_array=[];
    var question_name_array=[];
    var question_description_array=[];
    var test_name_array=[];
    var test_idid;
    var test_final_idid;
    
    
    //create element and render question
    function renderTests(doc){    
        // const thisQuestions = document.querySelector(string);
        let tr = document.createElement('tr');
        

        // let viewbtn = document.createElement('button');
        // let view = document.createElement('td');

        // let select = document.createElement('td');
        // let checkBox = document.createElement('input');
        let test_name = document.createElement('td');
        let created_on = document.createElement('td');
        let created_by = document.createElement('td');
        let test_description = document.createElement('td');
        let deletebtn = document.createElement('button');
        let updatebtn = document.createElement('button');
        let delete_test = document.createElement('td');

 
        
        // checkBox.type = "checkbox";
        
      


        test_name.setAttribute('data-id',doc.id);

        // viewbtn.textContent = "view";
        deletebtn.textContent = "delete";
        updatebtn.textContent = "update";
        test_name.textContent = doc.data().test_name;
        created_on.textContent = doc.data().created_on.toDate();        
        created_on.textContent = created_on.textContent.substring(0,25);
        created_by.textContent = doc.data().created_by;       
        test_description.textContent = doc.data().test_description;          
      
        tr.id = doc.id;

        // view.appendChild(viewbtn);
        // tr.appendChild(view);
        tr.appendChild(test_name);
        tr.appendChild(created_on);
        tr.appendChild(created_by);
        tr.appendChild(test_description);
        // select.appendChild(checkBox);
        // tr.appendChild(select);
        
        delete_test.appendChild(updatebtn);
        delete_test.appendChild(deletebtn);
        tr.appendChild(delete_test);
        tests.appendChild(tr);

        
        function open_test(){
            let test_name = document.createElement('p');
            test_name.textContent = doc.data().test_name;
            test_name.style.fontWeight = "bold";
            test_name.style.fontSize = "30px";
            nick_modal_content.appendChild(test_name);


            for (i=0;i<doc.data().question_description.length;i++){
                let number = document.createElement('p');
                number.textContent = "Question " + (i+1);
                number.style.fontWeight = "bold";
                number.style.fontSize = "20px";

                nick_modal_content.appendChild(number);

                let question_name = document.createElement('p');
                question_name.textContent = doc.data().question_name[i];
                nick_modal_content.appendChild(question_name);

                let question_description = document.createElement('p');
                question_description.textContent = doc.data().question_description[i];
                nick_modal_content.appendChild(question_description);
            }

            nick_modal.style.display="block";
        }

        test_name.addEventListener("click", (e)=>{
            open_test();
        })
        created_on.addEventListener("click", (e)=>{
            open_test();
        })
        created_by.addEventListener("click", (e)=>{
            open_test();
        })
        test_description.addEventListener("click", (e)=>{
            open_test();
        })

        deletebtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            let areyousure = document.createElement('p');
            areyousure.textContent = "Are you sure deleting "+doc.data().test_name+"? The test will be gone forever."
            nick_modal_content.appendChild(areyousure);

            let confirm = document.getElementById("confirm");
            confirm.style.display="block";
            nick_modal.style.display="block";

            let confirm_delete = document.getElementById("confirm_delete");
            confirm_delete.addEventListener('click',(e)=>{
                e.stopPropagation();
                db.collection('tests').doc(doc.id).delete();
                $("#tests tr#"+doc.id).remove();
                
                $("#nick_modal_content p").remove();
                confirm.style.display="none";
                let success_message = document.createElement("p");
                success_message.textContent = "Delete complete!"
                nick_modal_content.appendChild(success_message)
            })
        })
        updatebtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            manageTestTile.style.display="none";
            updateTestTile.style.display="block";
            test_idid = doc.id;
            test_final_idid = doc.data().test_final_id;
            for(i = 0;i<doc.data().question_description.length;i++){
                inputone.setAttribute("value",doc.data().test_name);
                inputtwo.setAttribute("value",doc.data().created_by);
                inputthree.setAttribute("value",doc.data().test_description);
                // value = ;
                question_id_array.push(doc.id+i);
                question_name_array.push(doc.data().question_name[i]);
                description_array.push(doc.data().question_description[i]);
                question_type_array.push(doc.data().question_type[i]);
                
                let tr2 = document.createElement('tr');
                let selected_question_type = document.createElement('td');
                let selected_question_name = document.createElement('td');
                let remove = document.createElement('td');
                let removebtn = document.createElement('button');
                tr2.id = doc.id+i;
                
                // selected_question_type.textContent = i;
                selected_question_name.textContent = doc.data().question_name[i];
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
                    question_name.textContent = doc.data().question_name[i];
                    nick_modal_content.appendChild(question_name);

                    let question_description = document.createElement('p');
                    question_description.textContent = doc.data().question_description[i];
                    nick_modal_content.appendChild(question_description);
                    nick_modal.style.padding="10rem 20rem";
                    nick_modal.style.display="block";
                })
                selected_question_type.addEventListener("click",(e)=>{
                    e.preventDefault();
                    let question_name = document.createElement('p');
                    question_name.textContent = doc.data().question_name[i];
                    nick_modal_content.appendChild(question_name);

                    let question_description = document.createElement('p');
                    question_description.textContent = doc.data().question_description[i];
                    nick_modal_content.appendChild(question_description);
                    nick_modal.style.padding="10rem 20rem";
                    nick_modal.style.display="block";
                })

                removebtn.addEventListener("click", (e)=>{
                    e.preventDefault();
                    $("#questions_selected tr#"+tr2.id).remove();
                    question_name_array.splice(question_id_array.indexOf(tr2.id),1);
                    description_array.splice(question_id_array.indexOf(tr2.id),1);
                    question_id_array.splice(question_id_array.indexOf(tr2.id),1);
                    question_type_array.splice(question_id_array.indexOf(tr2.id),1);
                })
            }
            
        })


        // checkBox.addEventListener("change", (e)=>{
        //     if(checkBox.checked){
        //         selected_tests_array.push(doc.id);
        //         test_name_array.push(doc.data().test_name);
        //         question_name_array.push(doc.data().question_name);
        //         question_description_array.push(doc.data().question_description);
        //     }
        //     else{
        //         if(selected_tests_array.includes(doc.id)){
        //             selected_tests_array.splice(selected_tests_array.indexOf(doc.id),1);
        //         }
        //     }
        // })
        
    }


    db.collection('tests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {           
                renderTests(doc);         
        })
         return 1;
    }).catch(error => { console.log('error') });




    function sortDb(string){
        $("#testsTable tbody tr").remove();
        db.collection('tests').orderBy(string).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {           
                    renderTests(doc);         
            })
             return 1;
        }).catch(error => { console.log('error') });
    }

    var sort_name = document.getElementById('sort_name');
    sort_name.addEventListener("click",(e)=>{
        e.stopPropagation();
        sortDb("test_name");
    })
    var sort_date = document.getElementById('sort_date');
    sort_date.addEventListener("click",(e)=>{
        e.stopPropagation();
        sortDb("created_on");
    })

    let confirm = document.getElementById("confirm");
    var close_view = document.getElementById('close_view');
    close_view.addEventListener("click",(e)=>{
        e.stopPropagation();
        $("#nick_modal_content p").remove();
        nick_modal.style.display="none";
        confirm.style.display="none";
    })

    var cancel = document.getElementById('cancel');
    cancel.addEventListener("click",(e)=>{
        e.stopPropagation();
        $("#nick_modal_content p").remove();
        nick_modal.style.display="none";
        confirm.style.display="none";
    })


    // var sort_admin = document.getElementById('sort_admin');
    // sort_admin.addEventListener("click",(e)=>{
    //     e.stopPropagation();
    //     sortDb("created_by");
    // })
    


    // var deleteTest = document.getElementById('deleteTest');
    
    
    // deleteTest.addEventListener("click", (e)=>{
    //     e.stopPropagation();
        
    //     for(i=0;i<selected_tests_array.length;i++) {
    //         // let id = e.target.parentElement.getAttribute('data-id');
    //         let id = selected_tests_array[i];
    //         db.collection('tests').doc(id).delete(); 
            
    //     }
    //     location.href='/test/manage-test';
    // })

    // var openTest = document.getElementById('openTest');
    // openTest.addEventListener("click", (e)=>{
        
    
    //     for(j=0;j<test_name_array.length;j++){
            
    //         var doc = new jsPDF();
    //         doc.text(10,10,"Test name: " + test_name_array[j]);
    //         doc.text(10,20,"Please solve the following questions!");
    //         doc.text(10,30,"Total page: " + (question_name_array[j].length+1).toString(10));
    //         doc.text(10,40,"Total questions: " + (question_name_array[j].length).toString(10));
            
    //         for(i=0;i<question_name_array[j].length;i++) {
    //             doc.addPage();
    //             doc.text(10,10,"Problem " + (i+1).toString(10));
    //             doc.text(10,20,question_name_array[j][i]+ "  <=Needs to be changed!");
    //             doc.text(10,30,question_description_array[j][i],{maxWidth:150});
    //             // doc.text(10,100,photoUrl_array[i],{maxWidth:150});
    //         }
    //         doc.save(test_name_array[j]+ '.pdf');
    //     }
        
        
    // })
    
    //create element and render question
    function renderQuestions(doc){    
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

        if (doc.data().type=="Descriptive") {
            tbodyid_=descriptiveQuestions;
        }
        else if (doc.data().type=="Code") {
            tbodyid_=codingQuestions;
        }

              
        tbodyid_.appendChild(tr);

        add_question.addEventListener("click", (e)=>{
            e.preventDefault();
            if(!question_id_array.includes(doc.id)){
                question_id_array.push(doc.id);
                question_name_array.push(doc.data().name);
                description_array.push(doc.data().description);
                question_type_array.push(doc.data().type);
                
                let tr2 = document.createElement('tr');
                let selected_question_type = document.createElement('td');
                let selected_question_name = document.createElement('td');
                let remove = document.createElement('td');
                let removebtn = document.createElement('button');
                tr2.id = doc.id;
                
                selected_question_type.textContent = doc.data().type;
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
                    question_type_array.splice(question_id_array.indexOf(doc.id),1);
                })
            }
        })

    }


    // db.collection('descriptive_questions').get().then((snapshot) => {
    //     snapshot.docs.forEach(doc => {         
    //         renderQuestions(doc,descriptiveQuestions,"Descriptive");
    //     })
    //     return 1;
    // }).catch(error => { console.log('error') });

    // db.collection('code_questions').get().then((snapshot) => {
    //     snapshot.docs.forEach(doc => {         
    //         renderQuestions(doc,codingQuestions,"Code");
    //     })
    //     return 1;
    // }).catch(error => { console.log('error') });
    
    db.collection('questions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc);
        })
        return 1;
    }).catch(error => { console.log('error') });
    
    
    var createTest = document.getElementById('createTest');
    var test_name = document.getElementById('inputone');
    var created_by = document.getElementById('inputtwo');
    var test_description = document.getElementById('inputthree');
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
            db.collection('tests').doc(test_idid).delete();
            // db.collection('tests_final').doc(test_final_idid).delete();
            db.collection('tests').add({
                test_name: test_name.value,
                created_on: firebase.firestore.Timestamp.fromDate(new Date()),
                created_by: created_by.value,
                test_description: test_description.value,
                question_name: question_name_array,
                question_description: description_array,
                question_type: question_type_array
                // test_final_id: docRef.id
            });

            // db.collection('tests_final').add({
            //     testName: test_name.value,
            //     createdOn: firebase.firestore.Timestamp.fromDate(new Date()),
            //     createdBy: created_by.value
            // })
            // .then(function(docRef){
            //     for (i=0;i<question_id_array.length;i++){
            //         if (question_type_array[i]==="Code"){
            //             db.collection('tests_final').doc(docRef.id).collection('code_questions').add({
            //                 description: description_array[i],
            //                 name: question_name_array[i]
            //             })
            //         }
            //         else if (question_type_array[i]==="Descriptive"){
            //             db.collection('tests_final').doc(docRef.id).collection('descriptive_questions').add({
            //                 description: description_array[i],
            //                 name: question_name_array[i]
            //             })
            //         }
            //     }



            // });

            document.getElementById('name_error').style.display="none";
            document.getElementById('created_by_error').style.display="none";
            document.getElementById('test_description_error').style.display="none";
            document.getElementById('create_success').style.display="block";



            let success_message = document.createElement('p');
            // let redirect_message = document.createElement('p');
            let go_manage_btn = document.createElement('button');
            let go_create_btn = document.createElement('button');
            go_manage_btn.textContent = "Go manage";
            go_create_btn.textContent = "Create more";

            success_message.textContent="Update " +test_name.value+" complete!";
            // redirect_message.textContent="Redirecting to the manage tests page";

            nick_modal_content.appendChild(success_message);
            // nick_modal_content.appendChild(go_create_btn);
            nick_modal_content.appendChild(go_manage_btn);
            // nick_modal_content.appendChild(redirect_message);
            nick_modal.style.display="block";
            nick_modal.style.padding="10rem 20rem";

            go_manage_btn.addEventListener("click",(e)=>{
                e.preventDefault();
                location.href='/test/manage-test';
            })
            go_create_btn.addEventListener("click",(e)=>{
                e.preventDefault();
                location.href='/test/create-test';
            })

            // location.href='/test/manage-test';
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
            test_name2.style.fontWeight = "bold";
            test_name2.style.fontSize = "30px";
            nick_modal_content.appendChild(test_name2);

            // console.log(question_id_array);
            for (i=0;i<question_id_array.length;i++){
                let id = question_id_array[i];
                let number = document.createElement('p');
                number.textContent = "Question " + (i+1);
                number.style.fontWeight = "bold";
                number.style.fontSize = "20px";
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
        // e.stopPropagation();
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
        // e.stopPropagation();
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


