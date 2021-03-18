const button = document.querySelector('#retry-button') //Pega o botão 'retry' através do ID e guarda em 'button'
document.getElementById("audio").volume = 0.05; //Controla o som das músicas de fundo

//Variáveis globais
var FormerPotGlobal = 0; //Guarda globalmente o pote onde estava o pokemon
var PreviousPokemonGlobal = 0; //Guarda globalmente o pokemon que estava em cima do pokemon que você mexeu
var ActualPokemonGlobal = 0; //Guarda globalmente o pokemon atual
var limit = document.querySelectorAll("div.droptarget"); //Pega todos os potes
var limitX = FindNumberOfPokemons(limit); //Guarda globalmente o número de pokemons diferentes que tem na fase
var limitY = limit[0].children.length //Variável que guarda o numero máximo de pokemons em um pote
var IsPoke = 0; //Variável que guarda se um pokemon está sendo largado em outro

//Adiciona um evento caso haja um click no botão para que execute uma função que da um reload na página
button.addEventListener('click', function(){window.location.reload();}) 

function FindNumberOfPokemons(div)//Função para pegar o número de pokemons
{
  var array = [] //Cria um vetor para guardar o nome das classes das imagens
  var Break = 0; //Cria uma variável que irá quebrar o loop
  
  for(i = 0; i < div.length; i++) //Terá o tamanho do número de potes
  {
    for(y = 0; y < div[i].children.length; y++) //Terá o tamanho do número de pokemons no pote
    {
      if(div[i].children[y].className != undefined && array.length > 0) //Verifica se a posição do pote não está vazia ou se não é o primeiro pokemon de todos
      {
        for(x = 0; x < array.length; x++) //Rodará o vetor inteiro
          if(array[x] == div[i].children[y].className) Break++; //Se o pokemon já estiver no vetor, aumentará o contador
          
        if(Break == 0) array.push(div[i].children[y].className);//Se o contador for igual a 0, significa que ele adicionará no vetor sem repetição
      }
      else if (div[i].children[y].className != undefined && array.length == 0) array.push(div[i].children[y].className); //Caso seja o primeiro pokemon de todos
      Break = 0;
    }
  }
  return array.length; //retorna o número de pokemons diferentes que tem na fase
}

function Ends(div)
{
  var CountPoke = 0; //Contador para verificar quantos pokemons iguais tem no mesmo pote
  var CountPot = 0; //Contador de quantos potes estão certos 

  for(i = 0; i < div.length; i++) //Rodará um loop que irá até o número de potes
  {
    for(y = 0; y < div[i].children.length; y++) //Rodará um loop que irá até o número de pokemons em cada pote
    {
      if(div[i].children[0].className == div[i].children[y].className) //Se o primeiro pokemon do pote for igual ao pokemon atual, ele somará no contador de pokemons
        CountPoke++;
      if(CountPoke == limitY) //Se o contador de pokemons for igual ao número total de pokemons, ele somará no contador de potes
        CountPot++;
    }
    CountPoke = 0;
    if(CountPot == limitX) //Se o contador de potes estiver igual ao número de potes, quer dizer que todos os pokemons estão no lugar certo
      box(); //E assim, chama a função que mostrará a tela de fase concluída
  }
}

function box()//Função para fazer aparecer a tela de jogo finalizado
{
  var modal = document.getElementById("myModal"); //Pega a div através do ID 'myModal'
  modal.style.display = "block"; //Troca o display da div, fazendo com que apareça na tela
}

function Unbox()//Função para fazer desaparecer a tela de menu de fases
{
  var modal = document.getElementById("myModal"); //Pega a div através do ID 'myModal'
  modal.style.display = "none";  //Troca o display da div, fazendo com que desapareça da tela
}

function check(event, CurrentPokemon)//Função para verificar se há pokemon antes
{
  var FormerPot = CurrentPokemon.parentElement; //Pega o pote onde estava o pokemon
  FormerPotGlobal = FormerPot; //Guarda o pote antigo em uma variável global
  var PreviousPokemon = CurrentPokemon.previousElementSibling; //Pega o pokemon que estava em cima do pokemon que você mexeu
  if(PreviousPokemon != null) //Se existir um pokemon antes, voce guardará o pokemon em variável global
    PreviousPokemonGlobal = PreviousPokemon;
}

function dragStart(event, ActualPokemon)//Função para começar a puxar
{
  ActualPokemonGlobal = ActualPokemon; //Guarda o pokemon atual na variável global
  check(event, ActualPokemon); //Chama a função para checar se há um pokemon antes
  event.dataTransfer.setData("Text", event.target.id); //Função para setar o dragging para o tipo e o dado que irá usar
}

function dragging(event){}//Função que ativa quando o pokemon está sendo puxado

function allowDrop(event, CurrentPot) {event.preventDefault();}//Função que permite soltar o pokemon

function denyDrop(event, CurrentPokemon){return IsPoke = 1;}//Função para evitar um bug que sumia um pokemon quando ele era largado em um pokemon

function drop(event, CurrentPot)//Função que verifica se é possível largar o pokemon
{
  if(IsPoke == 1) return IsPoke = 0; //Verifica se o local onde o pokemon está sendo largado é um pokemon ou um pote
  var NumberOfPokemon = CurrentPot.children.length; //Pega o número de pokemons onde o pokemon foi largado
  var ActualPot = CurrentPot; //Guarda na variável o pote atual
  var UpwardPokemon = CurrentPot.lastElementChild; //Pega o pokemon acima do pokemon que foi largado
  //Verifica se o pote está vazio ou se o pokemon que você pegou é igual ao pokemon que está na parte debaixo do pote
  if(UpwardPokemon == null || ActualPokemonGlobal.className == UpwardPokemon.className)
  {
    if(ItWorks(FormerPotGlobal, ActualPot) == false && NumberOfPokemon < limitY) //Verifica se o pote que estava o pokemon e o novo pote é o mesmo e se o número de pokemons não passou do limite
    {
      PreviousPokemonGlobal.draggable = "true"; //Deixa possível arrastar o pokemon que estava em cima do pokemon que foi arrastado
      if(NumberOfPokemon > 0) 
      { //Verifica se já tem algum pokemon que no pote que o pokemon foi largado e se sim, Bloqueia o pokemon acima de poder ser arrastado
        var AbovePokemon = CurrentPot.children[NumberOfPokemon-1];
        AbovePokemon.draggable = false;
      }
      event.target.appendChild(document.getElementById(event.dataTransfer.getData("Text"))); //Função que recupera os dados do dragging
    }
  }
  Ends(limit);
}

function ItWorks(begin, end) //Verifica se os potes são iguais
{
  if(begin == end) return true;
  else return false;
}