import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc,updateDoc,getDoc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp} from "firebase/firestore";
import { getAuth,signOut, createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'



const firebaseConfig = {
  apiKey: "AIzaSyDklKb54g0y6f7QMvfvruICxryn19CwQ1M",
  authDomain: "fir-yt-dcc5a.firebaseapp.com",
  projectId: "fir-yt-dcc5a",
  storageBucket: "fir-yt-dcc5a.firebasestorage.app",
  messagingSenderId: "386046673181",
  appId: "1:386046673181:web:008fcd06df2fa4dcc1a1f4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth();



// Initialize Firestore Service
const db = getFirestore(app);


// Reference to 'books' collection
const colRef = collection(db, 'books');


// queries
//const q = query(colRef, where("autor","==","LUIZ ORYONE MORAES LIRA 63", orderBy("createdAt")))
const q = query(colRef, orderBy("createdAt"))


// --- READ (Real-time data collection) ---
onSnapshot(
  // colRef,
  q,
  (snapshot) => {
    const books = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(books);
    // Aqui você pode adicionar lógica para renderizar os 'books' na interface HTML
  },
  (err) => {
    console.error("Erro no listener em tempo real: ", err.message);
  }
);

// --- CREATE (Adding documents) ---
const addBookForm = document.querySelector('.add');

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    autor: addBookForm.autor.value,
    titulo: addBookForm.titulo.value,
    data: addBookForm.data.value,
    valor: addBookForm.valor.value,
    createdAt: serverTimestamp()

  })
    .then(() => {
      addBookForm.reset();
      console.log("Documento adicionado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao adicionar documento: ", err.message);
    });
});

// --- UPDATE  (Updating a document) --- \\
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
e.preventDefault()
  const docRef = doc(db, 'books', updateForm.id.value)
  updateDoc(docRef, {
    titulo: 'updateForm.titulo.value'
})
.then(() => {
  updateForm.reset();
  console.log("Documento atualizado com sucesso!");
})
.catch((err) => {
  console.error("Erro ao atualizar o documento: ", err.message);
});
})



// --- DELETE (Deleting documents) ---   \\
const deleteBookForm = document.querySelector('.delete');

deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const docRef = doc(db, 'books', deleteBookForm.id.value);
  
  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset(); 
      console.log("Documento deletado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao deletar o documento: ", err.message);
    });
});


// --- SIGNIN USERS UP  --- \\
const signupForm = document.querySelector('.signup');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', `cred.user`);
      `signupForm.reset`();
    })
    .catch((err) => {
      console.log("As credenciais não foram validadas:", `err.message`);
    });
});

// --- LOGIN (Logando usuários existentes) --- \\
const loginForm = document.querySelector('.login');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('Usuário logado com sucesso:', cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.error("Erro ao fazer login:", err.message);
    });

    
    // logging in and out
    const logoutButton = document.querySelector('.logout')
    logoutButton.addEventListener('click', () => {
      signOut(auth)
      .then(() => {
        console.log('Usuário deslogado com sucesso');
      })
      .catch((err) => {
        console.error('Erro ao fazer logout:', err.message);
      });
    })

});
