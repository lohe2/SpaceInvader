const Score2 = document.querySelector("#Score")
const no = document.querySelector("#message");
const startImage = document.querySelector("#introImage")
const loseBtn = document.querySelector("#retryBtn")
const loseText = document.querySelector("#loseMessage")
const loseText2 = document.querySelector("#loseText")
document.addEventListener("keydown",(e)=>{
    if (e.key =='Enter'){
        no.style.visibility = 'hidden'
        startImage.style.visibility = 'hidden'
        animate()
    }
})






const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('#canvas1');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576



class Player{
    

    constructor(){
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
    
        const image =new Image();
        image.src = './img/spaceship.png'
        
        image.onload = ()=>{
            const scale = 0.15
            this.image = image;
            this.width = image.width *scale
            this.height = image.height*scale
            this.position = {
                x:canvas.width/2-this.width/2,
                y:canvas.height-this.height-30
            }
        }
    }
    
    draw(){
        
        //c.fillStyle = 'red';
        //c.fillRect(this.position.x,this.position.y,this.width,this.height);
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x+player.width/2,player.position.y+player.height/2)
        c.rotate(this.rotation)
        c.translate(-player.position.x-player.width/2,-player.position.y-player.height/2)
        c.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );
        c.rotate(this.rotation);
        c.restore()
    }
    update(){
        if (this.image){
            this.draw()
            this.position.x+= this.velocity.x
        }
        
    }
}

class Projectile{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
    }
}
class Particle{
    constructor({position,velocity,radius,color,fades}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
        if (this.fades){
            this.opacity -=0.01
        }
        
    }
}

class InvaderProjectile{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }
    draw2(){
        c.beginPath()
        c.fillStyle = '#BAA0DE'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        c.fill()
        c.closePath()
        
        
}
    update(){
        this.draw2()
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
        
    }
}

class Invader{
    

    constructor({position}){
        this.velocity = {
            x: 0,
            y: 0
        }
    
        const image =new Image();
        image.src = './img/invader.png'
        
        image.onload = ()=>{
            const scale = 1
            this.image = image;
            this.width = image.width *scale
            this.height = image.height*scale
            this.position = {
                x:position.x,
                y:position.y
            }
        }
    }
    draw(){
        //c.fillStyle = 'red';
        //c.fillRect(this.position.x,this.position.y,this.width,this.height);
        c.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );
    }
    update({velocity}){
        if (this.image){
            this.draw()
            this.position.x+= velocity.x
            this.position.y+= velocity.y
        }
        
    }
    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({
            position:{
                x:this.position.x+this.width/2,
                y:this.position.y+this.height
            },
            velocity:{
                x: 0,
                y: 5
            }
        }))
        
    
    }
}
class Grid{
    constructor(){
        this.position = {
            x:0,
            y:0
        }
        this.velocity = {
            x:3,
            y:0
        }
        this.invaders = []
        const columns = Math.floor(Math.random()*10+5)
        const rows = Math.floor((Math.random()*5)+  2)
        
        this.width = columns*30
        for (let x = 0;x<columns;x+=1){
            for (let y = 0;y<rows;y+=1){
                this.invaders.push(new Invader({position:{
                    x:x*30,
                    y:y*30
                }}))
        }
        }

    }
    update(){
        this.position.x+= this.velocity.x
        this.position.y+=this.velocity.y

        this.velocity.y = 0

        if (this.position.x+this.width>=canvas.width||this.position.x <=0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}
//Const

let player = new Player();
let projectiles = []
let particles =[]
let grids = []
let keys = {
    a: {
        pressed:false
    },
    d:{
        pressed:false
    },
    space:{
        pressed:false
    }
}
let invaderProjectiles = []


//let
let biggestScore = 0
let frames = 0

let randomInterval = Math.floor((Math.random()*500 )+500)
let game = {
    over:false,
    active:true
}
let score = 0
let BanAutoClick = false
//BACKGROUND





function createParticles({invader,color,fades}){
    for (let i = 0;i<15;i+=1){
        particles.push(new Particle({
            position:{
                x: invader.position.x + invader.width/2,
                y:invader.position.y + invader.height/2
            },
            velocity:{
                x:Math.random()-0.5,
                y:Math.random()-0.5
            },
            radius:Math.random()*3,
            color:color,
            fades
        }))
    }
}



function animate(){
    if(!game.active)return
    requestAnimationFrame(animate)

    canvas.width = 1024; //Update screen if changed
    canvas.height = 576; //This too
    
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    particles.forEach((particle,index) =>{

            if (particle.position.y-particle.radius>=canvas.height){
                particle.position.x = Math.random()*canvas.width
                particle.position.y = -particle.radius

            }
            if (particle.opacity<=0){
                setTimeout(()=>{particles.splice(index,1)})
                
            }else {
                particle.update()
            }
        
    })
    invaderProjectiles.forEach((invaderProjectile,index)=>{
        if (invaderProjectile.position.y+invaderProjectile.height>=canvas.height){
            
        }else invaderProjectile.update()

        if(invaderProjectile.position.y+invaderProjectile.height>=
            player.position.y&&
            invaderProjectile.position.y<=player.position.y+player.height&&
            invaderProjectile.position.x+invaderProjectile.width>=
            player.position.x&&
            invaderProjectile.position.x<=player.position.x+player.width){
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)
                player.opacity = 0
                game.over = true
            },0)
            setTimeout(()=>{
                game.active = false
                lose()
            },2000)
            createParticles({
                invader:player,
                color:'white',
                fades:true
            })
            
        }
    })
    //console.log(invaderProjectiles)
    projectiles.forEach((projectile,index)=>{
    
        if (projectile.position.y+projectile.radius<=0){
            setTimeout(()=>{
                projectiles.splice(index,1)
            },0)
            
        }else{
            projectile.update()
        }
        
    })
    grids.forEach((grid,gridIndex)=>{
        grid.update()
        
        if (frames%100 === 0&&grid.invaders.length>0){
            
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader,i)=>{
            invader.update({velocity:grid.velocity})
            projectiles.forEach((projectile,j)=>{
                if (projectile.position.y-projectile.radius<=invader.position.
                        y+invader.height &&
                    projectile.position.x+projectile.radius>= 
                        invader.position.x &&
                    projectile.position.x-projectile.radius<=
                        invader.position.x+invader.width &&
                    projectile.position.y + projectile.radius>=
                        invader.position.y
                    ){
    
                    


                    setTimeout(()=>{
                        const invaderFound = grid.invaders.find(
                            (invader2)=> invader2===invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2)=>projectile2 ===projectile
                        )
                        // remove invader
                        if (invaderFound&&projectileFound){
                            score+=100
                           // console.log(score)
                            scoreEl.textContent = score
                            createParticles({
                                invader:invader,
                                color:'#BAA0DE',
                                fades:true
                            })
                            grid.invaders.splice(i,1)
                            projectiles.splice(j,1)

                            if (grid.invaders.length>0){
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.
                                invaders.length-1]
                                
                                grid.width = 
                                lastInvader.position.x-
                                firstInvader.position.x+
                                lastInvader.width
                                grid.position.x = firstInvader.position.x

                            } else{
                                grids.splice(gridIndex,1)
                            }
                        }
                    },0)
                }

            })
        //console.log(grid.invaders)
        })
    
    })


    if(keys.a.pressed&&player.position.x >0){
        player.velocity.x = -7
        player.rotation = -0.15
    }
    else if (keys.d.pressed&&player.position.x+player.width<canvas.width){
        player.velocity.x = 7
        player.rotation = 0.15
    }
    else{
        player.velocity.x = 0
        player.rotation = 0
    }

    
    if (frames % randomInterval===0){
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random()*500 )+500)
        frames = 0
    }
    
    
    frames+=1
    //console.log(frames)

}

addEventListener('keydown',(event)=>{

    if (game.over)return
    switch(event.key){
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            if (BanAutoClick == false){
                BanAutoClick = true
                projectiles.push(new Projectile({
                    
                    position:{
                        x:player.position.x+player.width/2,
                        y:player.position.y+player.height/2
                    },
                    velocity:{
                        x:0,
                        y:-10
                    }
                }))
                setTimeout(()=>{
                    BanAutoClick = false
                },100)
            }
                
            break
    }
    //console.log(projectiles)
})
addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            
            break
    }
})
for (let i = 0;i<100;i+=1){
    particles.push(new Particle({
        position:{
            
            x: Math.random()*canvas.width,
            y:Math.random()*canvas.height
        },
        velocity:{
            x:0,
            y:1
        },
        radius:Math.random()*3,
        color:'white'

    }))
}
function lose(){
    //startImage.style.visibility = "visible"
    if (score> biggestScore){biggestScore = score}
    Score2.textContent = "Highest Score: "+String(biggestScore)
    loseText.style.visibility = "visible"
    loseText2.textContent = endMessages[Math.floor(Math.random()*(endMessages.length))]
    
}
endMessages = ["You are a failed abortion","Your mother never wanted you","You failed the world","You are a disapointment"]

loseBtn.addEventListener("click",()=>{
    
    startImage.style.visibility = "hidden"
    loseText.style.visibility = "hidden"
    player = new Player();
    projectiles = []
    particles =[]
    for (let i = 0;i<100;i+=1){
        
        particles.push(new Particle({
            position:{
                
                x: Math.random()*canvas.width,
                y:Math.random()*canvas.height
            },
            velocity:{
                x:0,
                y:1
            },
            radius:Math.random()*3,
            color:'white'
    
        }))
    }
    grids = []
    keys = {
    a: {
        pressed:false
    },
    d:{
        pressed:false
    },
    space:{
        pressed:false
    }
    }
    invaderProjectiles = []
    frames = 0

    randomInterval = Math.floor((Math.random()*500 )+500)
    game = {
    over:false,
    active:true
    }
    score = 0
    BanAutoClick = false
    
    animate()
    
})