const express = require('express');
const mongooes = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'view')));


//--------------------mongooes connected to node js --------------------------

mongooes.connect('mongodb://127.0.0.1:27017/eventtSchedul')
    .then(() => { console.log("mongooes is succeccfull conected to node js") })
    .catch(() => { console.log("coulden't connected to mongooes") })

const logicSchema = mongooes.Schema({
    username: { type: String, required: true, minlength: 1 },
    password: { type: String, required: true, minlength: 1 }
})

const eventSchema = mongooes.Schema({
    username: { type: String, required: true, minlength: 1 },
    gmail: { type: String, required: true, minlength: 1 },
    password: { type: String, required: true, minlength: 1 },
    eventName:{ type: String, required: true},
    duration: { type: Number, required: true },
    StartingTime: { type: Date, required: true },
    endingTime: { type: Date, required: true }
})

const userdata = mongooes.model("users", logicSchema)

const eventData = mongooes.model("events", eventSchema)

//--------------API-------------------------------------------------

app.get("/Home", async (req, res) => {
    res.render(__dirname + `/view/index`)
})

app.get('/Admain',async(req,res)=>{
    try {
        const data = await eventData.find({})
        res.render(__dirname+"/view/admain",{data:data})       
    }
    catch(e)
    {
        console.log("error?Admain")
    }
})

app.get('/login/DataEntry', async (req, res) => {
    let username = req.query.Gmail;
    console.log(username)
     try {
        const data = await userdata.findOne({ username: `${username}` })
         console.log( "ttt" + data)
         if (data.username === username) {
             const events = await eventData.find({gmail: `${username}`});
             console.log(events)
            //  res.send(username +'  '+ data.username + ' '+ events);
             res.render(__dirname + `/view/DataEntry`,{data:events})
         }
    }
    catch(e) { console.log("this is my error --- " +e); }
})

app.post('/login/DataEntry', async (req, res) => {
    let name = req.body.Username.trim();
    let email = req.body.email.trim();
    let duratoin = req.body.duratoin.trim();
    let EventName = req.body.Event_name.trim();
    let StartingTime = req.body.StartingTime.trim();
    let EndingTime = req.body.EndingTime.trim();
    let pass ="123";
    console.log(name+' '+email+' '+duratoin+' '+EventName+' '+StartingTime+' '+EndingTime)
    try{

        const event = await eventData.create({  
            username: `${name}`,
            gmail: `${email}`,
            password: `${pass}`,
            eventName: `${EventName}`,
            duration: `${ duratoin }`,
            StartingTime: `${ StartingTime }`,
            endingTime: `${ EndingTime }`
        })
        res.redirect(`/login/DataEntry?Gmail=${email}`)

    }catch(e) { console.log("this is my error login/DataEntry --- " +e); }
})

app.get('/login/DataEntry/delete',async(req,res)=>{
    let id=req.query.id;
    let gmail=req.query.gmail;
    console.log(id+gmail);
    // res.send(id+gmail);
    try{
        // const data = await userdata.deleteOne({ _id: `${id}` })
        // // res.send(gmail+" deleted");
        // res.redirect(`/login/DataEntry?Gmail=${gmail}`)

        const data = await userdata.deleteOne({ _id: new mongooes.Types.ObjectId(id) });

        if (data.deletedCount === 0) {
            console.log("No document found with the provided id");
            res.status(404).send("No document found");
        } else {
            console.log("Document deleted successfully");
            res.redirect(`/login/DataEntry?Gmail=${gmail}`);
        }
    }catch(e) { console.log("this is my error login/DataEntry/delete --- " +e); }
})


app.get("/login", async (req, res) => {
    res.render(__dirname + `/view/login`)
})

app.post("/login", async (req, res) => {
    let name = req.body.userName;
    let pass = req.body.pass;
    name = name.trim();
    pass = pass.trim();
    // console.log(name+pass);
    try {
        const data = await userdata.find({ username: `${name}` })
        // const data = await userdata.find({})
        // console.log(data.length)
        if (data.length < 1) {
            res.send(`<h>not found</h><br><a href="/login">return</a><br><a href="/home">return home</a>`);
        }
        else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].password === pass) {
                    // res.render(__dirname+"/view/DataEntry",{data1:data})
                    console.log(data[i].username)
                    // name=data[i].username
                    res.redirect(`/login/DataEntry?Gmail=${data[i].username}`)
                }
            }
            res.send(`<h> password error </h> <a href="/login">return</a> <br><a href="/home">return home</a>`);
        }
    }
    catch (err) { console.log(err); }
})

app.get('/registion', async (req, res) => {

    let email = req.query.Email;
    let password = req.query.pass;

    // let email = req.perams.Email; 
    // let password = req.perams.pass;  

    console.log(email + password)
    try {
        const data = await userdata.create({ username: `${email}`, password: `${password}` })
        console.log(data);
        res.status(201).redirect('/login');//send(`registration succeccfuly<br> <a href="/login">return</a>`) ;
    }
    catch (e) { console.log(e); }
})






app.listen(3000, () => {
    console.log("server is runing at 3000");
})