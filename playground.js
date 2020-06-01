const jwt = require('jsonwebtoken')


const obj = {
  mama: "jadzia",
  tata: "Andrzej",
  syn: "Marcin"
}


// console.log(Object.keys(obj))


const myF = async () => {
  const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse');
  console.log(token)
}

myF()
