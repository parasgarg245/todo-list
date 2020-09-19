const express=require("express");
const bodyParaser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");


const app=express();
app.set('view engine', 'ejs');
app.use(bodyParaser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDb", { useNewUrlParser: true, useUnifiedTopology: true});
 
const itemSchema=mongoose.Schema({
    name: String
})

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name: "welcome to your todolist "
})

const item2=new Item({
    name: " hit the+ button to add a new item"
})

const item3=new Item({
    name:"<-- hit this to delete an item"
})


const listSchema={
    name: String ,
    items:[itemSchema]
};

const List=mongoose.model("List",listSchema);

const defaaultitems=[item1,item2,item3];






;
app.get("/",function(req,res){
    
    let Day=date.getday();

    Item.find({},function(err,founditem){
        if(defaaultitems.length===0)
            Item.insertMany(defaaultitems, function (err) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully added the default items to db")
                res.redirect("/");
            })
        else    
            res.render("list", { listTitle: Day, newListItem: founditem })
    })
    
    
})

app.post("/", function (req, res) {
    let day = date.getday();
   var itemdata = req.body.element;
   var listtitle=req.body.list;
    const newitem = new Item({
        name: itemdata
    })

   if(listtitle===day){
       newitem.save();
       res.redirect("/");

   }
   else{
       List.findOne({name: listtitle} , function(err,foundlist){
           foundlist.items.push(newitem);
           foundlist.save();
           res.redirect("/"+listtitle);
       })
   }

   
  

})
app.post("/delete",function(req,res){
    const checkitemid=req.body.checkbox;
    Item.findByIdAndRemove(checkitemid,function(err){
        if(err)
            console.log(err)
        else
            console.log("Succesfully deleted checked item")
    })
    res.redirect("/");
})

app.get("/:customListNAme",function(req,res){
    const customListNAme=req.params.customListNAme;

    List.findOne({name:customListNAme},function(err,foundlist ){
        if(!err){
            if(!foundlist){
                const list = new List({
                    name: customListNAme,
                    items: defaaultitems
                })
                list.save();
                res.redirect("/"+customListNAme)
            }
            else{
                res.render("list", { listTitle: foundlist.name, newListItem: foundlist.items })
            }
        }
    })

   
})



app.listen(3000,function(){
    console.log('server is started on port 3000');
});