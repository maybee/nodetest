var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('rankings', { 
    });   
});

/* GET home page. */
router.get('/admin', function(req, res) {
    var db = req.db;
    var collection = db.get('nodes');
    collection.find({},{},function(e,docs){
        res.render('admin', {
            "nodes" : docs
        });
    });
});

/* GET total rankings */
router.get('/rankings', function(req, res) {
    var db = req.db;
    var collection = db.get('rankings');

    var data ={};

    var updateData=function(){
        var len = arguments.length,
        i=0;
        for(i=0;i<len;i++){
            data[arguments[i].name]=arguments[i].value;
        }
    };
    updateData(
        {name:"mb",value:0}, 
        {name:"aj",value:0}, 
        {name:"hb",value:0}, 
        {name:"ja",value:0},
        {name:"aa",value:0},
        {name:"lb",value:0},
        {name:"js",value:0}
    );

    /*
        find all virtual = false
        and last virtual = true
    */

    collection.find({},{},function(e,docs){


        /*
        calculate ranks
        ["aj","mb","js"]
        ["mb","aj","js"]
        */

        //Filter, so only show the last virtual

        docs.reverse();
        var virtualFound = false;

        docs.forEach(function(doc) {
            
            if (!doc.virtual || (doc.virtual && !virtualFound))
            {

                var rankObj = doc.ranks;

                doc.ranks.forEach(function(rank) {
                    
                    switch(rank) {

                        case "mb":
                            updateData({name:"mb",value:data.mb+ (7-rankObj.indexOf(rank))});
                            break;
                        case "js":
                            updateData({name:"js",value:data.js+ (7-rankObj.indexOf(rank))});
                            break;
                        case "aj":
                            updateData({name:"aj",value:data.aj+ (7-rankObj.indexOf(rank))});
                            break;
                        case "aa":
                            updateData({name:"aa",value:data.aa+ (7-rankObj.indexOf(rank))});
                            break;
                        case "lb":
                            updateData({name:"lb",value:data.lb+ (7-rankObj.indexOf(rank))});
                            break;
                        case "ja":
                            updateData({name:"ja",value:data.ja+ (7-rankObj.indexOf(rank))});
                            break;
                        case "hb":
                            updateData({name:"hb",value:data.hb+ (7-rankObj.indexOf(rank))});
                            break;
                    }
                });

                if (doc.virtual)
                    virtualFound = true;

            }
        });
        
        var dataArray = [];
        for (var name in data) {
            dataArray.push([name, data[name]])
        }
        
        dataArray.sort(function(a, b) {return b[1]-a[1]})

        res.render('rankings', {
            "rankings" : dataArray
        });
    });
});


/* POST to new ranking Service */
router.post('/addRanking', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var playerRanks = req.body.playerRanks.split(",");


    // Set our collection
    var collection = db.get('rankings');

    var virtual = req.body.virtual;
    if (virtual==null)
        virtual = true;
    else
        virtual = false;

    console.log(virtual);

    // Submit to the DB
    collection.insert({
        "datetime" : new Date(),
        "virtual" : virtual,
        "ranks": playerRanks
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("rankings");
            // And forward to success page
            res.redirect("rankings");
        }
    });
});

module.exports = router;
