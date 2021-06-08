const express = require("express");
const app = express();
const {uuid} = require("uuidv4");
app.use(express.json());

//middlewares
const verificacaoid = (request,response,next) => {
  const {id} = request.params;
  const index = localdb.findIndex(func => func.id === id);
  if(index < 0) {
      return response.status(404).json("O id do funcionário nao foi encontrado");
  }
  next();
  
}
const verificacaoinfo = (request,response,next) => {

  const {nome,funcao,departamento,email,telefone} = request.body;
 
  if(nome == undefined ||funcao == undefined||departamento == undefined ||email == undefined || telefone == undefined) {
      return response.status(400).json("Existem informações faltando")
  }
  next();
  
}

//cadastro de funcionários
var localdb = [];

app.get("/funcionario",(request,response)=>{
  return response.status(200).json(localdb);

});
app.post("/funcionario", (request,response)=>{
  const {nome,funcao,departamento,email,telefone} = request.body;

  const funcionario = {
    id: uuid(), 
    nome: nome,
    funcao: funcao,
    departamento: departamento,
    email: email,
    telefone: telefone,

}

localdb = [...localdb, funcionario]; 
return response.status(200).json(funcionario);


});

//verificação pelo id
app.get("/funcionario/:id", verificacaoid, (request,response) => {
  const {id} = request.params;
  const index = localdb.findIndex (func => func.id === id);
  const funcionario = localdb[index];
  return response.status(200).json(funcionario);
})

//Deletar pelo Id
app.delete('/funcionario/:id', verificacaoid, (request,response) => {
  const {id} = request.params;
  const index = localdb.findIndex (func => func.id === id);
  localdb.splice(index, 1);
  return response.status(200).send();
});

//alterar as informações do funcionário
app.put('/funcionario/:id', verificacaoid, verificacaoinfo, (request,response) => {
  const {id} = request.params;
  const {nome,funcao,departamento,email,telefone} = request.body;

  const funcionario = localdb.findIndex(func => func.id === id);
  const novofunc = {
      id,
      nome,
      funcao,
      departamento,
      email,
      telefone,
  }
  localdb.splice(funcionario, 1, novofunc);
  
  return response.status(200).json(novofunc);
});


//porta onde o servidor está rodando juntamente com o aviso de funcionamento do mesmo
app.listen(3000, ()=>{
  console.log(`Servidor iniciado com sucesso!`);
});