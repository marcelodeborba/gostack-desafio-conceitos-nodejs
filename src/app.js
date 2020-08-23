const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository => repository.id === id );

  if(findRepIndex === -1){
    return response.status(400).json({error: 'O repositório não existe.'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepIndex].likes,
  };

  repositories[findRepIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository => repository.id === id );

  if (findRepIndex > -1) {
    repositories.splice(findRepIndex, 1);
  } else {
    response.status(400).send(json({error: 'Repositório não existe.'}));
  }
  
  return response.status(204).send();  
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository => repository.id === id );

  if (findRepIndex === -1){
    return response.status(400).json({error: 'O repositório não existe.'});
  }

  repositories[findRepIndex].likes++;

  return response.json(repositories[findRepIndex]);
});

module.exports = app;
