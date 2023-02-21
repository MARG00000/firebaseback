

const express = require('express')
const bcrypt = require('bcrypt')
const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDoc,doc ,setDoc} = require('firebase/firestore')
require('dotenv/config')

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCV09dQesKQ0_vvoh6agzzFFpT6FJvmz18",
    authDomain: "backfirebase-78c56.firebaseapp.com",
    projectId: "backfirebase-78c56",
    storageBucket: "backfirebase-78c56.appspot.com",
    messagingSenderId: "113329125484",
    appId: "1:113329125484:web:bb39c48bca636bc832c049"
  };
  

// Inicializar BD con Firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

// Inicializar el servidor
const app = express()
app.use(express.json())

//ruta registro
app.get('/usuarios', async(req, res) =>{
   const colRef = collection(db,'users')
   const docsSnap = await getDoc(colRef)
  let data = []
   docsSnap.forEach(doc=>{
   data.push(doc.data())
     })
res.json({
   'alert':'Success',
   data
   })
  })

app.post('/login',(req,res) =>{
  let { email,passwped} = req.body

  if (!email.length|| !password.length){
    returnres.json({
      'alert':'no se han recibido los datos correctamente'
    })
  }

  const users =collection(db,'users')
  getDoc(doc(user,email))
  .then(user =>{
    if(!user.exists)
    {
      return res.json({
        'alert':'correo no registrado'
      })
    } else{
      bcrypt.compare(password, user.data().password,(error,result) =>{
        let data = user.data()
        if(result)
        {
          res.json({
            'alert':'Seccess',
          name:data.name,
          email:data.email
          })
        }else{
          return
        }
      })
    }
  })
})


// Rutas para las peticiones EndPoint | API
app.post('/registro', (req, res) => {
  const { name, lastname, email, password, number } = req.body

  // Validaciones de los datos
  if(name.length < 3){
    res.json({
      'alert': 'nombre requiere mínimo 3 caracteres'
    })
  }else if(lastname.length < 3){
    res.json({
      'alert': 'apellido requiere mínimo 3 caracteres'
    })
  }else if (!email.length) {
    res.json({
      'alert': 'debes escribir correo electrónico'
    })
  } else if (password.length < 8) {
    res.json({
      'alert': 'contra requiere mínimo 8 caracteres'
    })
  } else if (!Number(number) || number.length < 10) {
    res.json({
      'alert': 'Introduce un número telefónico correcto'
    })
  } else {
    const users = collection(db, 'users')

    // Verificar que el correo no exista en la colección
    getDoc(doc(users, email)).then( user => {
      if (user.exists()){
        res.json({
          'alert': 'El correo ya existe en la base de datos'
        })
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash

            // Guardar en la base de datos
            setDoc(doc(users, email), req.body).then(() => {
              res.json({
                'alert': 'Success!!',
              })
            })
          })
        })
      }
    })
  }
})

//ejecutamos el servidor
const PORT = process.env.PORT || 19000

// Ejecutamos el servidor
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})
