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

    

    var questions_name_array =[];
    var description_array=[];
    // var photoUrl_array=[];
    
    
    //create element and render question
    function renderQuestions(doc, string){    
        // const thisQuestions = document.querySelector(string);
        let tr = document.createElement('tr');
        let select = document.createElement('td');
        let question_name = document.createElement('td');
        let description = document.createElement('td');
        let checkBox = document.createElement('input');


        tr.setAttribute('data-id',doc.id);
        checkBox.type = "checkbox";
        question_name.textContent = doc.data().name;
        description.textContent = doc.data().description;

        select.appendChild(checkBox);
        tr.appendChild(select);
        tr.appendChild(question_name);
        tr.appendChild(description);
              
        string.appendChild(tr);
        
        checkBox.addEventListener("change", (e)=>{
            if(checkBox.checked){
                questions_name_array.push(doc.data().name);
                description_array.push(doc.data().description);
                // photoUrl_array.push(doc.data().photoUrl);
            }
            // else{
            //     if(questions_id_array.includes(doc.id)){
            //         questions_id_array.splice(questions_id_array.indexOf(doc.id),1);
            //     }
            // }
        })
    }


    db.collection('descriptive_questions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc,theoreticalQuestions);
        })
        return 1;
    }).catch(error => { console.log('error') });

    db.collection('code_questions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {         
            renderQuestions(doc,codingQuestions);
        })
        return 1;
    }).catch(error => { console.log('error') });
    
    
    var createTest = document.getElementById('createTest');
    var test_name = document.getElementById('test_name');
    // createTest.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     db.collection('tests').add({
    //         test_name: test_name.value,
    //         create_time: firebase.firestore.Timestamp.fromDate(new Date()),
    //         questions_id: questions_id_array
    //     });
    //     location.href='/test/create-test';
    // })

    createTest.addEventListener('click',(e)=>{
        e.preventDefault();
        // var doc = new jsPDF();
        // doc.text(10,10,"Test name: " + test_name.value);
        // doc.text(10,20,"Please solve the following questions!");
        // doc.text(10,30,"Total page: " + (questions_name_array.length+1).toString(10));
        // doc.text(10,40,"Total questions: " + (questions_name_array.length).toString(10));
        
        // for(i=0;i<questions_name_array.length;i++) {
        //     doc.addPage();
        //     doc.text(10,10,"Problem " + (i+1).toString(10));
        //     doc.text(10,20,questions_name_array[i]+ "  <=Needs to be changed!");
        //     doc.text(10,30,description_array[i],{maxWidth:150});
        //     // doc.text(10,100,photoUrl_array[i],{maxWidth:150});
        // }
        // doc.save(test_name.value+ '.pdf');

        db.collection('tests').add({
            test_name: test_name.value,
            create_time: firebase.firestore.Timestamp.fromDate(new Date()),
            questions_name: questions_name_array,
            description: description_array
        });
        location.href='/test/create-test';

        // var storageRef = firebase.storage().ref('tests/'+ test_name.value+ '.pdf');
        // storageRef.put(doc);
        
    })
    
   


    
}());


