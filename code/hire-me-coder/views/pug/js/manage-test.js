(function () {


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



    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
            console.log('not logged in');
            location.href = '/login';
        }
    });

    var selected_tests_array = [];
    var question_name_array = [];
    var question_description_array = [];
    var test_name_array = [];


    //create element and render question
    function renderQuestions(doc) {
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
        let delete_test = document.createElement('td');



        // checkBox.type = "checkbox";

        test_name.setAttribute('data-id', doc.id);

        // viewbtn.textContent = "view";
        deletebtn.textContent = "delete";
        test_name.textContent = doc.data().test_name;
        created_on.textContent = doc.data().created_on.toDate();
        created_on.textContent = created_on.textContent.substring(0, 25);
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
        delete_test.appendChild(deletebtn);
        tr.appendChild(delete_test);
        tests.appendChild(tr);


        function open_test() {
            let test_name = document.createElement('p');
            test_name.textContent = doc.data().test_name;
            test_name.style.fontWeight = "bold";
            test_name.style.fontSize = "30px";
            nick_modal_content.appendChild(test_name);


            for (i = 0; i < doc.data().question_description.length; i++) {
                let number = document.createElement('p');
                number.textContent = "Question " + (i + 1);
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

            nick_modal.style.display = "block";
        }

        test_name.addEventListener("click", (e) => {
            open_test();
        })
        created_on.addEventListener("click", (e) => {
            open_test();
        })
        created_by.addEventListener("click", (e) => {
            open_test();
        })
        test_description.addEventListener("click", (e) => {
            open_test();
        })

        deletebtn.addEventListener("click", (e) => {
            e.stopPropagation();
            let areyousure = document.createElement('p');
            areyousure.textContent = "Are you sure deleting " + doc.data().test_name + "? The test will be gone forever."
            nick_modal_content.appendChild(areyousure);

            let confirm = document.getElementById("confirm");
            confirm.style.display = "block";
            nick_modal.style.display = "block";

            let confirm_delete = document.getElementById("confirm_delete");
            confirm_delete.addEventListener('click', (e) => {
                e.stopPropagation();
                db.collection('tests').doc(doc.id).delete();
                $("#tests tr#" + doc.id).remove();

                $("#nick_modal_content p").remove();
                confirm.style.display = "none";
                let success_message = document.createElement("p");
                success_message.textContent = "Delete complete!"
                nick_modal_content.appendChild(success_message)
            })
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
            renderQuestions(doc);
        })
        return 1;
    }).catch(error => { console.log('error') });




    function sortDb(string) {
        $("#testsTable tbody tr").remove();
        db.collection('tests').orderBy(string).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderQuestions(doc);
            })
            return 1;
        }).catch(error => { console.log('error') });
    }

    var sort_name = document.getElementById('sort_name');
    sort_name.addEventListener("click", (e) => {
        e.stopPropagation();
        sortDb("test_name");
    })
    var sort_date = document.getElementById('sort_date');
    sort_date.addEventListener("click", (e) => {
        e.stopPropagation();
        sortDb("created_on");
    })

    let confirm = document.getElementById("confirm");
    var close_view = document.getElementById('close_view');
    close_view.addEventListener("click", (e) => {
        e.stopPropagation();
        $("#nick_modal_content p").remove();
        nick_modal.style.display = "none";
        confirm.style.display = "none";
    })

    var cancel = document.getElementById('cancel');
    cancel.addEventListener("click", (e) => {
        e.stopPropagation();
        $("#nick_modal_content p").remove();
        nick_modal.style.display = "none";
        confirm.style.display = "none";
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


}());


