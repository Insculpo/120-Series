///Trenten Kaufeldt-lira
//For CMPM 120
//Lifts a lot of code from the phaser tutorial.
//I also used paint to modify the sky background to fit the altered screen size.

//new Phaser.game sets the game up.
//Param 1-2 : Width/Height ratio
//Param 3 : Phase mode, AUTO defaults to webGL, but will default to Canvas is not available.
// Param 4: ID of the dominant element for the canvas, blank on default.
// Param 5 : An object that preloads and creates the environment.
var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//Score is always initialized to zero.
var score = 0;
var scoreText;

//The main purpose of preload is to feed assets into Phaser using data from the files within.
function preload() {
	// preload assets
  //Just adds the asset sprites from the img file of the bootstrap.
  //Param one - Name of sprite
  //Param two - Location of sprite file
  game.load.image('sky', 'assets/img/sky.png', 600, 800);
  game.load.image('ground', 'assets/img/platform.png');
  game.load.image('star', 'assets/img/star.png');
  game.load.image('diamond', 'assets/img/diamond.png');
  //Similar to image, but with the addition of 32,48 as a means of coordinating the sprite reading mechanism.
  //Here the dimensions are x: 32 y: 48, so it will read in 32x48 pixel tiles for this animated sprite.
  game.load.spritesheet('dude', 'assets/img/baddie.png', 32, 32);
}

	// A global variable for the platforms group.
  var platforms;

//Create initializes the game itself, setting the level up before the actual play begins.
  function create() {
    cursors = game.input.keyboard.createCursorKeys();

      //Sets the system mode to ARCADE mode, which means arcade style physics.
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // Implements the sky sprite into the game.
      game.add.sprite(0, 0, 'sky');

      //
      platforms = game.add.group();

      //  We will enable physics for any object that is created in this group
      platforms.enableBody = true;

      // This is the ground
      var ledge = platforms.create(0, game.world.height - 100, 'ground');
      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      ledge.scale.setTo(2, 5);

      //  This stops it from falling away when you jump on it
      ledge.body.immovable = true;

      //  The top platform
      var ledge = platforms.create(200, 100, 'ground');
      ledge.scale.setTo(0.5, 1);

      ledge.body.immovable = true;

      //  A left platform
      ledge = platforms.create(40, 250, 'ground');
      ledge.scale.setTo(0.5, 1);
      ledge.body.immovable = true;

      //  A right platform
      ledge = platforms.create(340, 250, 'ground');
      ledge.scale.setTo(0.5, 1);

      ledge.body.immovable = true;

      //  A middle, upper platform
      var ledge = platforms.create(150, 550, 'ground');
      ledge.scale.setTo(0.6, 1);
      ledge.body.immovable = true;

      //  A middle, lower platform
      var ledge = platforms.create(158, 450, 'ground');
      ledge.scale.setTo(0.7, 1);
      ledge.body.immovable = true;

      //  A middle, lower platform
      var ledge = platforms.create(200, 550, 'ground');
      ledge.scale.setTo(0.6, 1);
      ledge.body.immovable = true;

      // The player sprite
    player = game.add.sprite(32, game.world.height - 250, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    //Due to the dog having less frames, it is just an array of 2 frames.
    //There is no static frame that faces toward the screen for the dog,
    //So a system had to be made to allow the dog to face the right direction.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2, 3], 10, true);

    //Creates the star and diamond groups.
    stars = game.add.group();
    diamonds = game.add.group();

    //This makes it so the collectables can be interracted with.
    stars.enableBody = true;
    diamonds.enableBody = true;


    //Places the diamond on the level by checking to see
    //if the region is occupired by the ground sprite.
    //This is basically an algorithm meant to reduce or get rid of sprites that overlap with objects.
    //This is done with both the stars and diamonds.
    //Diamonds fall faster than stars and bounce higher.
    if(diamonds.total == 0)
    {
      //This will loop until the diamond finds an appropriate spot to place itself.
      while(diamonds.total == 0)
      {
        console.log(diamonds.total);
        var xroll, yroll;
        //Randomly places the diamond around the screen.
        //The coordinates are modified to prevent the diamond from being easily attained.
        xroll = 300 + Math.random() * 300;
        yroll = Math.random() * 600;
        var diamond = diamonds.create(xroll, yroll, 'diamond');
        if(game.physics.arcade.overlap(diamond, platforms))
        {
          diamond.kill();
        }
        else {
          diamond.body.gravity.y = 36;
          diamond.body.bounce.y = 0.7 + Math.random() * 0.8;
        }
      }
    }

    //  The star generator uses a similar method to the diamond placement, except now with many objects.
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create( Math.random() * 600, Math.random() * 600 , 'star');
        console.log(diamonds.total);
        var xroll, yroll;
        //Randomly places stars at these coordinates.
        xroll = Math.random() * 600;
        yroll = Math.random() * 600;
        //The i-- is to prevent the loop from populating the game world with less stars
        if(game.physics.arcade.overlap(star, platforms))
        {
          //Culls the star, goes backwards in the loop and makes another attempt.
          star.kill();
          i--;
        }
        else {
        //  Let gravity do its thing
        star.body.gravity.y = 6;
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
      }
    }
    //Adds the star text to the game world at 16,16.
    //Switched to white because it fits in better with the colors given.
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
}

//This still switch is used to allow the dog to face the direction
//it is staying still.
var Still = false;;

//Update carries out ingame actions as the game time advances, this mainly pretains to player actions.
//At least for this game.
function update() {

  //  Hit platform checks if the player is colliding with the platforms.
  //This is important to make jump work properly.
  var hitPlatform = game.physics.arcade.collide(player, platforms);

  //Collide and overlap act as means to enable collision detection.
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(diamonds, platforms);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  //Left cursor vs right cursor acts as the default key mappings for Phaser.
  //It allows for both WASD and Arrow Keys.
  if (cursors.left.isDown)
  {
      //  Move to the left
      player.body.velocity.x = -150;
      //Still is set to true so the player faces left if cursors.left is down.
      Still = true;
      player.animations.play('left');
  }
  else if (cursors.right.isDown)
  {
    //Still is set to false so the player faces right if cursors.right is down.
      Still = false;
      //  Move to the right
      player.body.velocity.x = 150;
      player.animations.play('right');
  }
  else
  {
      // If still is true, the player will face right.
      //Should the player not be moving, one of these two still frames are picked
      //From the player sprite set.
      if(Still == true)
      {
        player.animations.stop();
        player.frame = 1;
      }else {
        player.animations.stop();
        player.frame = 2;
      }
  }
  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down && hitPlatform)
  {
      player.body.velocity.y = -350;
  }

}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}
//Just a variation of collect star.
function collectDiamond (player, diamond) {

    // Removes the star from the screen
    diamond.kill();

    //  Add and update the score
    score += 25;
    //There is no actual variable with the score text.
    //It's just a string that gets replaced with an updated value.
    scoreText.text = 'Score: ' + score;
}
