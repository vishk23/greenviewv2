// // Import PIXI Application
// const Application = PIXI.Application;

// // Create PixiJS Application
// const app = new Application({
//     width: window.innerWidth,
//     height: window.innerHeight,
//     transparent: false,
//     antialias: true
// });

// // Set Background Color
// app.renderer.backgroundColor = 0x23395D;

// // Make the canvas resize with the window and position it
// app.renderer.view.style.position = 'absolute';
// app.renderer.resize(window.innerWidth, window.innerHeight);

// // Append PixiJS canvas to the body
// document.body.appendChild(app.view);

// // Load the GIF as a background texture
// const gifTexture = PIXI.Texture.from('./images/background.gif'); // Replace with the path to your GIF

// // Use the GIF as a Sprite for the background
// const gifBackground = new PIXI.Sprite(gifTexture);

// // Resize the GIF to cover the full screen
// gifBackground.width = app.screen.width;
// gifBackground.height = app.screen.height;

// // Add the GIF background sprite to the stage
// app.stage.addChild(gifBackground);

// // Update the size of the GIF when the window resizes
// window.addEventListener('resize', () => {
//     app.renderer.resize(window.innerWidth, window.innerHeight);
//     gifBackground.width = app.screen.width;
//     gifBackground.height = app.screen.height;
// });

// // Array of image URLs - Update the paths to match the images in your assets folder
// const imageUrls = [
//     './images/image1.png',
//     './images/image2.png',
//     './images/image3.png',
//     './images/image4.png',
//     './images/image5.png',
//     './images/image6.png',
//     './images/image7.png',
//     './images/image8.png',
// ];

// // Array to hold the sprites
// const sprites = [];

// // Number of falling items you want (e.g., 50)
// const totalItems = 50;

// // Define the range where the items will stop falling
// const minHeight = app.screen.height * 0.6; // Minimum height (e.g., 60% of screen height)
// const maxHeight = app.screen.height * 0.9; // Maximum height (e.g., 90% of screen height)

// // Loop to create many sprites using the same 8 images repeatedly
// for (let i = 0; i < totalItems; i++) {
//     const texture = PIXI.Texture.from(imageUrls[i % imageUrls.length]);
//     const sprite = new PIXI.Sprite(texture);

//     // Set the initial position of each sprite randomly at the top of the screen
//     sprite.x = Math.random() * app.screen.width;
//     sprite.y = -100;

//     // Set random speed for falling animation
//     sprite.speed = 1 + Math.random() * 2;

//     // Set a random "floor height" between minHeight and maxHeight where the sprite will stop falling
//     sprite.floorHeight = minHeight + Math.random() * (maxHeight - minHeight);

//     // Set a scale to make the sprites smaller (optional)
//     sprite.scale.set(0.3);

//     // Add the sprite to the stage and to the array
//     app.stage.addChild(sprite);
//     sprites.push(sprite);
// }

// // Add an animation loop using app.ticker
// app.ticker.add((delta) => {
//     const gravity = 0.5;
//     let allLanded = true;

//     // Update each sprite position
//     for (let i = 0; i < sprites.length; i++) {
//         const sprite = sprites[i];

//         // Make sure sprites fall until they reach their assigned floor height
//         if (sprite.y < sprite.floorHeight) {
//             sprite.y += sprite.speed * gravity * delta; // Gravity and speed factor for smooth animation
//             allLanded = false;
//         } else {
//             sprite.y = sprite.floorHeight; // Ensure it stops at its specific floor height
//         }
//     }

//     // Stop the ticker if all the sprites have landed
//     if (allLanded) {
//         app.ticker.stop();
//     }
// });
