//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dog1img, dog2img;
var button1, button2;
var fedTime, lastFed;
var foodObj;

foodS = 20;

function preload()
{
  //load images here
  dog1img = loadImage("images/dogImg.png");
  dog2img = loadImage("images/dogImg1.png");
}

function setup() 
{
  createCanvas(1280,720);

  database = firebase.database();

  foodObj = new food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  
  dog = createSprite(500,400);

  button1 = createButton("Feed The Dog");
  button1.position(700,95);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(800,95);
  button2.mousePressed(addFood);
}


function draw() 
{  
  background(46,139,87);

  dog.addImage(dog1img);

  dog.scale = 0.2;

  fedTime = database.ref("fedTime");
  fedTime.on("value",
  function(data)
  {
    lastFed = data.val();
  }
  )

  textSize(20);
  fill("white");
  if(lastFed>=12)
  {
    text("Last Feed : " + lastFed%12 + "PM",350,25);
  }
  else if(lastFed === 0)
  {
    text("Last Feed : 12AM",350,30);
  }
  else
  {
    text("Last Feed : " + lastFed + "AM",350,30);
  }

  drawSprites();
  //add styles here
  textSize(20);
  fill("white")
  text("Food Stock :- "+foodS,100,50);
  //text("NOTE :- Press Up Arrow To Feed The Dog",50,50);
  foodObj.display();
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x)
{
  if(x<=0)
  {
    x = 0
  }
  else
  {
    x = x - 1;
  }

  database.ref("/").update
  ({
    Food : x
  })
}*/

function addFood()
{
  database.ref("/").update
  (
    {
      Food : foodS + 1
    }
  )
}

function feedDog()
{
  dog.addImage(dog2img);
  foodObj.deductFoodStock()
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  //foodObj.getFedTime(lastFed);

  database.ref("/").update
  (
    {
      Food : foodObj.getFoodStock(),
      fedTime : hour()
    }
  )
}