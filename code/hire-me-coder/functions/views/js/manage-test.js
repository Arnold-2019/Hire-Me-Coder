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

    


    var selected_tests_array=[];
    var questions_name_array=[];
    var description_array=[];
    var test_name_array=[];
    
    //create element and render question
    function renderQuestions(doc){    
        // const thisQuestions = document.querySelector(string);
        let tr = document.createElement('tr');

        let select = document.createElement('td');
        let checkBox = document.createElement('input');
        let test_name = document.createElement('td');

        // let create_time = document.createElement('td');
        // let create_admin = document.createElement('td');
        
        checkBox.type = "checkbox";


        tr.setAttribute('data-id',doc.id);

        test_name.textContent = doc.data().test_name;
    
        // create_time.textContent = doc.data().create_time;

        select.appendChild(checkBox);
        tr.appendChild(select);
        tr.appendChild(test_name);

        // tr.appendChild(deleteTest);
        // tr.appendChild(create_time);
        // tr.appendChild(create_admin);
 
        tests.appendChild(tr);

        

        checkBox.addEventListener("change", (e)=>{
            if(checkBox.checked){
                selected_tests_array.push(doc.id);
                test_name_array.push(doc.data().test_name);
                questions_name_array.push(doc.data().questions_name);
                description_array.push(doc.data().description);
            }
            else{
                if(selected_tests_array.includes(doc.id)){
                    selected_tests_array.splice(selected_tests_array.indexOf(doc.id),1);
                }
            }
        })
        
    }


    db.collection('tests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc);
        })
        return 1;
    }).catch(error => { console.log('error') });


    var deleteTest = document.getElementById('deleteTest');
    deleteTest.addEventListener("click", (e)=>{
        e.stopPropagation();
        
        for(i=0;i<selected_tests_array.length;i++) {
            // let id = e.target.parentElement.getAttribute('data-id');
            let id = selected_tests_array[i];
            db.collection('tests').doc(id).delete(); 
            
        }
        location.href='/test/manage-test';
        
        
    })

    var openTest = document.getElementById('openTest');
    openTest.addEventListener("click", (e)=>{
        
    
        for(j=0;j<test_name_array.length;j++){
            
            var doc = new jsPDF();
            doc.text(10,10,"Test name: " + test_name_array[j]);
            doc.text(10,20,"Please solve the following questions!");
            doc.text(10,30,"Total page: " + (questions_name_array[j].length+1).toString(10));
            doc.text(10,40,"Total questions: " + (questions_name_array[j].length).toString(10));
            
            for(i=0;i<questions_name_array[j].length;i++) {
                doc.addPage();
                doc.text(10,10,"Problem " + (i+1).toString(10));
                doc.text(10,20,questions_name_array[j][i]+ "  <=Needs to be changed!");
                doc.text(10,30,description_array[j][i],{maxWidth:150});
                // doc.text(10,100,photoUrl_array[i],{maxWidth:150});
            }
            doc.save(test_name_array[j]+ '.pdf');
        }
        
        
    })

    
}());


