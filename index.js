const express = require('express')
const bcrypt = require('bcrypt')
const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDoc, doc, setDoc, getDocs, deleteDoc, updateDoc} = require('firebase/firestore')
const cors = require('cors')
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

const corsOptions = {
  "origin": "*",
  "optionsSucessStatus": 200
}

app.use(express.json())
app.use(cors(corsOptions))


// Rutas para las peticiones EndPoint | API
app.post('/registro', (req, res) => {
  const { name, lastname, email, password, number } = req.body

  // Validaciones de los datos
  if(name.length < 3){
    res.json({
      'alert': 'nombre requiere mínimo 3 caracteres'
    })
  }else if (lastname.length < 3) {
    res.json({
      'alert': 'apellido requiere mínimo 3 caracteres'
    }) 
  } else if (!email.length) {
    res.json({
      'alert': 'debes escribir correo electrónico'
    })
  } else if (password.length < 8) {
    res.json({
      'alert': 'La contraseña requiere mínimo 8 caracteres'
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
            setDoc(doc(users, email), req.body).then(reg => {
              res.json({
                'alert': 'Seccess'
              })
            })
          })
        })
      }
    })
  }
})

app.get('/usuarios', async (req, res) => {
  const colRef = collection(db, 'users')
  const docsSnap = await getDocs(colRef)
  let data = []
  docsSnap.forEach(doc => {
    data.push(doc.data())
  })
  res.json({
    message: "Usuarios",
    'alert': 'Success!!',
    data
  })
})

app.post('/login', (req, res) => {
  let {email, password} = req.body

  if(!email.length || !password.length){
    res.json({
      'alert': 'No se han recibido los datos correctamente'
    })
  }

  const users = collection(db, 'users')
  getDoc(doc(users, email))
  .then(user => {
    if(!user.exists()){
      return res.json({
        'alert': 'Correo no registrado en la base de datos'
      })
    } else {
      bcrypt.compare(password, user.data().password, (error, result) => {
        if (result) {
          let data = user.data()
          res.json({
            'alert': 'Seccess',
            name: data.name,
            email: data.email
          })
        } else {
          return res.json({
            'alert': 'Contraseña incorrecta'
          })
        }
      })
    }
  })
})

app.post('/delete', (req, res) => {
  let { email } = req.body

  deleteDoc(doc(collection(db, 'users'), email))
  .then((response) => {
    res.json({
      message: 'Usuario Borrado',
      'alert': 'Seccess'
    })
  })
  .catch((error) => {
    res.json({
      'alert': error
    })
  })
})

app.post('/update', (req, res) => {
  const { name, lastname, email, number } = req.body

  if(name.length < 3){
    res.json({
      'alert': 'nombre requiere mínimo 3 caracteres'
    })
  }else if (lastname.length < 3) {
    res.json({
      'alert': 'apellido requiere mínimo 3 caracteres'
    }) 
  } else if (!Number(number) || number.length < 10) {
    res.json({
      'alert': 'Introduce un número telefónico correcto'
    })
  } else {
    const usuarioActu = collection(db, 'users')
    const updateData = {
      name,
      lastname,
      number
    }
    updateDoc(doc(usuarioActu, email), updateData, email)
    .then((response) => {
      res.json({
        message: 'usuario actualizado',
        'alert': 'Seccess'
      })
    })
    .catch((error) => {
      res.json({
        'alert': error
      })
    })
  }
})

const PORT = process.env.PORT || 19000

// Ejecutamos el servidor
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})