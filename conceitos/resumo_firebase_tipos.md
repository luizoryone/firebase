# Resumo: Integração Firebase e Tipos de Dados HTML

Esta nota documenta as correções e aprendizados da integração de um projeto Web com o Firebase Firestore.

## 1. Atualização do Firebase: v8 (Namespaces) vs v9+ (Modular)

Ao utilizar o Firebase SDK versão 9 ou superior (como a v12.13.0 do projeto), a sintaxe foi alterada para um formato modular/funcional. Isso ajuda o bundler (Webpack) a realizar "Tree Shaking", reduzindo o tamanho do arquivo final, pois importa apenas as funções que são utilizadas.

**Código Antigo (v8):**
```javascript
// Acesso através do objeto global "firebase"
const db = firebase.firestore();
db.collection('books');
```

**Código Moderno (v9+):**
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Acesso injetando a dependência de um serviço no outro
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'books');
```

## 2. Manipulação de Dados (Snapshots)

Para iterar e resgatar dados do Firebase (`QueryDocumentSnapshot`), a melhor prática é usar funções imutáveis do JavaScript, como o `.map()`, em conjunto com variáveis do tipo `const`.

Isso garante uma tipagem segura e cria uma lista simples e manipulável de "Plain JavaScript Objects" (Objetos puros JS), contendo tanto os dados do documento quanto o ID único.

```javascript
// get collection data
getDocs(colRef)
  .then((snapshot) => {
    // Uso de .map() e Spread Operator (...)
    const books = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log(books);
  })
```

## 3. Mapeamento de Tipos de Input HTML e Firebase

Para que o formulário HTML respeite os tipos de dados definidos no banco de dados (Firestore), os campos `<input>` devem ser configurados corretamente usando os atributos `type` apropriados.

| Campo Firebase | Tipo Firestore | Input HTML Correto |
| :--- | :--- | :--- |
| **autor** | `string` | `<input type="text" name="autor">` |
| **titulo** | `string` | `<input type="text" name="titulo">` |
| **data** | `timestamp` | `<input type="date" name="data">` |
| **valor** | `double` | `<input type="number" name="valor" step="0.01">` |

### Importante no momento de salvar (Insert)
Como os dados coletados do HTML sempre vêm como formato de texto (String), é importante convertê-los antes de enviá-los ao Firestore usando JavaScript:
*   Para Double: `parseFloat(valorInput)`
*   Para Timestamp: `new Date(dataInput)` ou `Timestamp.fromDate(new Date(dataInput))`
