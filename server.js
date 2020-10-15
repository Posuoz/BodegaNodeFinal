// installation de tous les modules
//framework express qui nous aide à créer le router
const express = require('express');
const app = express();
const mongoose=require("mongoose");
const fs = require('fs');


//pour récupérer les informations du formulaire
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


// utilisation des template EJS grâce au modules npm "ejs"
app.set('views', './views');
app.set('view engine', 'ejs');

// on indique à express où sont les fichiers statiques js, image et css
app.use(express.static(__dirname + '/public'));


// connexion à notre base de donnée grâce au module mongoose
let db=mongoose.connect("mongodb://localhost/bodega",{useNewUrlParser: true, useUnifiedTopology: true });

//gestion des messages 
mongoose.connection.on("error",function(){
    console.log("Erreur de connexion à la base de données");
})
mongoose.connection.on("open",function(){
    console.log("Connexion réussie");
})

//création des schémas
let platsSchema = mongoose.Schema({
    Categorie:String,
    Miseenavant:Number,
    Disponibilité:Boolean,
    Nom:String,
    Description:String,
    Prix:Number,
    Image:String
});

//création des models
let Plat = mongoose.model("Plat",platsSchema);

//ADMIN PAGE
app.get('/admin', (req, res) =>{
res.render('admin');

});


//soumission du formulaire
app.post('/admin', function(req,res){ 
    let Nom = req.body.Nom; 
    let Description = req.body.Description; 
    let Prix = req.body.Prix; 
    let Image = req.body.Image;
    let Categorie = req.body.Categorie;
    let Disponibilité;
    if(req.body.Disponibilité){Disponibilité=true} else {Disponibilité=false};
    let Miseenavant;
    if(req.body.Miseenavant){Miseenavant=true} else {Miseenavant=false};

    let data = { 
        "Nom": Nom, 
        "Description":Description, 
        "Prix":Prix,
        "Categorie":Categorie,
        "Image":Image,
        "Disponibilité":Disponibilité,
        "Miseenavant":Miseenavant
    } 
    

    let myData = new Plat(data);
    myData.save();
    console.log(data);
    res.redirect("/carte"+Categorie);
    
    
})

//liste des produits
app.get('/liste', (req, res)=>{
    Plat.find({Disponibilité:true}).sort('Miseenavant').exec(function(err,plat){
        if(err)throw err;
        console.log(plat);
        res.render('liste',{plat:plat});
    })
})

//HOME PAGE
app.get('/', (req, res)=>{
	res.render('index');
});

//LOGIN PAGE
app.get('/login', (req, res)=>{
	res.render('login');
});

//TOUTE LA CARTE
app.get('/carte', (req, res)=>{
    Plat.find({Disponibilité:true}).sort('Miseenavant').exec(function(err,plat){
        if(err)throw err;
        console.log(plat);
        res.render('carte',{plat:plat});
    })
})

//CARTE PAR CATEGORIE
app.get('/carte/:cat', (req, res)=>{
    let cat = req.params.cat;
    Plat.find({Disponibilité:true,Categorie:cat}).sort('Miseenavant').exec(function(err,plat){
        if(err)throw err;
        console.log(plat);
        res.render('carte',{plat:plat});
    })
})

// Ajout admin par categorie
app.get ('/admin/:cat', (req,res)=>{
    let cat = req.params.cat;
    Plat.find({Disponibilité:true,Categorie:cat}).sort('Miseenavant').exec(function(err,plat){
        if(err)throw err;
        console.log(plat);
        res.render('carte',{plat:plat});
    })
})


app.use(function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.status(404).send('Page introuvable');
})


app.listen(3000);


// Je n'arrive pas à aligner les données de mon tableau :'(