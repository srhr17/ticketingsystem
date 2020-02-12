
var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var validator = require("aadhaar-validator");
var SHA256 = require("crypto-js/sha256");
var today = new Date();
// var cur_origin = "Madurai";
// var cur_origin = "Palaghat";
var cur_origin = "Coimbatore";
// var cur_origin = "Chennai";
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

class Block {
  constructor(index, timestamp, data, previoushash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoushash = previoushash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
      this.timestamp +
      this.previoushash +
      JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }
  createGenesisBlock() {
    return new Block(0, this.dateTime, "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previoushash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

let savejeecoin = new BlockChain();

var mysqlConnection = mysql.createConnection({
  host: "35.226.81.169",
  user: "admin",
  password: "qwertyuiop",
  database: "ticketing"
});

mysqlConnection.connect(err => {
  if (!err) console.log("Connection succeeded.");
  else
    console.log("Unsuccessful \n Error : " + JSON.stringify(err, undefined, 2));
});

app.post("/error", function (req, res) {
  res.writeHead(200, { "content-type": "text/html" });
  res.write(
    "<!DOCTYPE html> <head></head>  <body>  <h1>           Please Enter a Valid Amount For Recharge</h1></body>"
  );
});

app.post('/driver', function (req, res) {
  res.writeHead(200, { "content-type": "text/html" });
  var vehicle_no = req.body.vehicle_no;
  console.log(vehicle_no);
  // res.send('POST request to the homepage')
  mysqlConnection.query("select * from wallet where aadhar_no in (select aadhar_no as aadharno from travel where travelstatus = 1 && vehicle_no=?)", [vehicle_no], function (err, result, field) {

    if (!err) {
      for (let i = 0; i < result.length; i++) {
        console.log(result);
        mysqlConnection.query("select price as price,origin as origin from pricedetails where destination=? && origin=(select origin from travel where aadhar_no=? && travelstatus=1)", [cur_origin, result[i].aadhar_no], function (ierr, iresult, ifield) {
          var x = result[i].balance;
          var y = iresult.price
          console.log(result[i].balance - iresult[0].price);
          if ((result[i].balance - iresult[0].price) > 0) {
            console.log(
              result[i].aadhar_no
            );

            res.write(
              "<!DOCTYPE html> <head></head> <body> <h1 style='color: green;'> Seat No : " +
              (i + 1) + " </h1> <h1 style='color: green;'>    Aadhar Number : </h1><h4 style='color: green;'>" +
              result[i].aadhar_no +
              " </h4> <h1 style='color: green;'>    Balance : </h1><h4 style='color: green;'>" +
              result[i].balance +
              " </h4> <h1 style='color: green;'>    Total Fare : </h1><h4 style='color: green;'>" +
              iresult[0].price +
              " </h4> <h1 style='color: green;'>    Origin : </h1><h4 style='color: green;'>" +
              iresult[0].origin +
              " </h4> <h1 style='color: green;'>    Current Station : </h1><h4 style='color: green;'>" +
              cur_origin +

              "</h4> <hr> </body>"
            );
          }
          else {
            console.log(
              result[i].aadhar_no
            );
            res.write(
              "<!DOCTYPE html> <head></head> <body> <h1 style='color: red;> Seat No : " +
              (i + 1) + " </h1> <h1 style='color: red;'>    Aadhar Number : </h1><h4 style='color: red;'>" +
              result[i].aadhar_no +
              " </h4> <h1 style='color: red;'>    Balance : </h1><h4 style='color: red;'>" +
              result[i].balance +
              " </h4> <h1 style='color: red;'>    Total Fare : </h1><h4 style='color: red;'>" +
              iresult[0].price +
              " </h4> <h1 style='color: red;'>    Origin : </h1><h4 style='color: red;'>" +
              iresult[0].origin +
              " </h4> <h1 style='color: red;'>    Current Station : </h1><h4 style='color: red;'>" +
              cur_origin +
              "</h4> <hr> </body>"
            );
          }




        });




      }
    }

  });

})


app.post("/entry", function (req, res) {
  res.writeHead(200, { "content-type": "text/html" });
  var aadhar = req.body.aadhar;
  var vehicle_no = req.body.vehicle_no;
  var pin = req.body.pin;

  var re = 'uid="(.*?)"';

  var found = aadhar.match(re);

  var json = "";
  var here1;
  var here2;
  var originl;
  var destinl;
  var amt;
  var seats;
  var nseats;
  var check = validator.isValidNumber(found[1]);
  // var check = validator.isValidNumber(aadhar);
  console.log(aadhar);
  console.log(vehicle_no);
  if (check) {
    console.log("Valid Number " + found[1]);

    mysqlConnection.query(
      "select count(*) as count from wallet where aadhar_no = ?",
      [found[1]],
      function (err, rows, fields) {
        //if (err) throw err;

        var string = JSON.stringify(rows);

        json = JSON.parse(string);
        here1 = json[0].count;
        console.log(here1);
        if (1 == here1) {
          console.log("Existing user");
          mysqlConnection.query(
            "select origin,destination from vehicledetails where vehicle_no=?",
            [vehicle_no],
            function (orerr, orrow, orfields) {
              var orstring = JSON.stringify(orrow);
              var orjson = JSON.parse(orstring);
              originl = orjson[0].origin;
              destinl = orjson[0].destination;
              console.log(originl);
              console.log(destinl);
              mysqlConnection.query(
                "select price from pricedetails where origin=? and destination=?",
                [originl, destinl],
                function (prerr, prrow, prfields) {
                  var prstring = JSON.stringify(prrow);
                  var prjson = JSON.parse(prstring);
                  price = prjson[0].price;
                  console.log(price);
                  mysqlConnection.query(
                    "select balance from wallet where aadhar_no=?",
                    [found[1]],
                    function (werr, wrow, wfields) {
                      var wstring = JSON.stringify(wrow);
                      var wjson = JSON.parse(wstring);
                      amt = wjson[0].balance;


                      console.log(amt);
                      if (amt >= price) {
                        console.log("Issue Ticket");

                        mysqlConnection.query(
                          "select no_of_seats from seatstatus where vehicle_no=?",
                          [vehicle_no],
                          function (serr, srow, sfields) {
                            var sstring = JSON.stringify(srow);
                            var sjson = JSON.parse(sstring);
                            seats = sjson[0].no_of_seats;
                            console.log(seats);
                            mysqlConnection.query(
                              "select no_of_seats_occupied from seatstatus where vehicle_no=?",
                              [vehicle_no],
                              function (nerr, nrow, nfields) {
                                var nstring = JSON.stringify(nrow);
                                console.log(nrow);
                                var njson = JSON.parse(nstring);
                                nseats = njson[0].no_of_seats_occupied;
                                console.log(nseats);
                                if (seats == nseats) {
                                  res.write(
                                    "<!DOCTYPE html> <head></head>  <body>  <h1>           BUS IS FULL " +
                                    "</h1></body>"
                                  );
                                } else {
                                  mysqlConnection.query(
                                    "select count(*) as count from travel where aadhar_no = ? && travelstatus = 1 ",
                                    [found[1]],

                                    function (xerr, xrow, xfields) {
                                      var xstring = JSON.stringify(xrow);
                                      var xjson = JSON.parse(xstring);
                                      //seats = sjson[0].no_of_seats;
                                      console.log(
                                        "Current status" + xjson[0].count
                                      );
                                      if (xjson[0].count === 0) {
                                        mysqlConnection.query(
                                          "update seatstatus set no_of_seats_occupied=no_of_seats_occupied+1 where vehicle_no=?",
                                          [vehicle_no],
                                          function (nerr, nrow, nfields) {
                                            mysqlConnection.query(
                                              "insert into travel (aadhar_no,timeentry,origin,vehicle_no,travelstatus) VALUES (?,?,?,?,?)",
                                              [
                                                found[1],
                                                time,
                                                cur_origin,
                                                vehicle_no,
                                                1
                                              ],
                                              function (ierr, irow, ifields) {
                                                res.write(
                                                  "<!DOCTYPE html> <head></head>  <body>  <h1>            Ticket Issued " +
                                                  "</h1> <br><h1> Aadhar Number: " +
                                                  found[1] +
                                                  "</h1> <br><h1> Time: " +
                                                  time +
                                                  "</h1> <br><h1> Origin: " +
                                                  cur_origin +
                                                  "</h1> <br><h1> Vehicle Number: " +
                                                  vehicle_no +
                                                  "</h1></body>"
                                                );


                                              }
                                            );
                                          }
                                        );
                                      }
                                      else {
                                        console.log("Deleting Ticket . . .");
                                        mysqlConnection.query("select count(*) as counti from travel where aadhar_no=? && travelstatus = 1 && vehicle_no=?", [found[1], vehicle_no], function (gherr, ghrow, ghfields) {
                                          var ghstring = JSON.stringify(ghrow);
                                          var ghjson = JSON.parse(ghstring);
                                          //seats = sjson[0].no_of_seats;
                                          console.log(
                                            "Traveler travelling" + ghjson[0].counti
                                          );

                                          if (ghjson[0].counti == 1) {




                                            mysqlConnection.query(
                                              "select origin from travel where aadhar_no=? && travelstatus = 1 ",
                                              [found[1]],
                                              function (berr, brow, bfields) {
                                                var bstring = JSON.stringify(brow);
                                                var bjson = JSON.parse(bstring);
                                                //seats = sjson[0].no_of_seats;
                                                console.log(
                                                  "Origin" + bjson[0].origin
                                                );

                                                mysqlConnection.query(
                                                  "select price from pricedetails where origin=? &&destination=?",
                                                  [bjson[0].origin, cur_origin],

                                                  function (terr, trow, tfields) {
                                                    var tstring = JSON.stringify(
                                                      trow
                                                    );
                                                    var tjson = JSON.parse(tstring);
                                                    //seats = sjson[0].no_of_seats;
                                                    console.log(
                                                      "Travel Cost : " +
                                                      tjson[0].price
                                                    );
                                                    mysqlConnection.query("select balance from wallet where aadhar_no=?", [found[1]], function (tyerr, tyrows, tyfields) {
                                                      var tystring = JSON.stringify(tyrows);
                                                      var tyjson = JSON.parse(tystring);
                                                      console.log(tyjson[0].balance);
                                                      if (tyjson[0].balance >= tjson[0].price) {

                                                        console.log(tyjson[0].balance + " " + tjson[0].price);
                                                        mysqlConnection.query("update wallet set balance=balance-? where aadhar_no=?", [tjson[0].price, found[1]]);
                                                        mysqlConnection.query("select balance from wallet where aadhar_no=?", [found[1]], function (txerr, txrows, txfields) {
                                                          var txstring = JSON.stringify(txrows);
                                                          var txjson = JSON.parse(txstring);
                                                          console.log(txjson[0].balance);


                                                          mysqlConnection.query(
                                                            "update travel set timeexit=?,destination=?,price=?,travelstatus=? where aadhar_no=? ",
                                                            [time, cur_origin, tjson[0].price, 0, found[1], vehicle_no],

                                                            function (qerr, qrow, qfields) {
                                                              res.write(
                                                                "<!DOCTYPE html> <head></head>  <body>  <h1>            Ticket Deleted " +
                                                                "</h1> <br><h1> Aadhar Number: " +
                                                                found[1] +
                                                                "</h1> <br><h1> Time: " +


                                                                time +
                                                                "</h1> <br><h1> Origin: " +
                                                                bjson[0].origin +
                                                                "</h1> <br><h1> Destination: " +
                                                                cur_origin +
                                                                "</h1> <br><h1> Total Fare: " +
                                                                tjson[0].price +
                                                                "</h1> <br><h1> Wallet Balance: " +
                                                                txjson[0].balance +
                                                                "</h1> <br><h1> Vehicle Number: " +
                                                                vehicle_no +
                                                                "</h1></body>"
                                                              );

                                                              mysqlConnection.query(
                                                                "select no_of_seats_occupied from seatstatus where vehicle_no=?",
                                                                [vehicle_no],

                                                                function (herr, hrow, hfields) {
                                                                  var hstring = JSON.stringify(
                                                                    hrow
                                                                  );
                                                                  var hjson = JSON.parse(hstring);

                                                                  console.log(
                                                                    "Seats Remaining " +
                                                                    (hjson[0].no_of_seats_occupied--)
                                                                  );
                                                                  mysqlConnection.query(
                                                                    "update seatstatus set no_of_seats_occupied=no_of_seats_occupied-1 where vehicle_no=?",
                                                                    [vehicle_no],

                                                                    function (oerr, orow, ofields) {
                                                                      res.write(
                                                                        "<!DOCTYPE html> <head></head>  <body> <br> <h1>Number of Passangers in the bus : " + hjson[0].no_of_seats_occupied + "</h1></body>"

                                                                      );

                                                                    }
                                                                  );

                                                                }
                                                              );
                                                            });



                                                        }
                                                        );
                                                      }
                                                      else {
                                                        res.write(
                                                          "<!DOCTYPE html> <head></head>  <body> <br>  <h1> Low Balance . . .  To Recharge , <a href='http://104.154.132.33:3000/'> Click Here. . .</a></h1></body>"
                                                        );
                                                        console.log("Recharge Balance");
                                                      }

                                                    });


                                                  }
                                                );


                                              }
                                            );
                                            //
                                          }
                                          else {
                                            res.write(
                                              "<!DOCTYPE html> <head></head>  <body> <br>  <h1> Don't Play with Us!...You are Already Travelling...</h1></body>"
                                            );
                                          }
                                        });


                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        );
                      } else {
                        res.write(
                          "<!DOCTYPE html> <head></head>  <body> <br>  <h1> Low Balance . . .  To Recharge , <a href='http://104.154.132.33:3000/'> Click Here. . .</a></h1></body>"
                        );
                        console.log("Recharge Balance");

                      }
                    }
                  );
                }
              );
            }
          );
        } else {
          res.write(
            "<!DOCTYPE html> <head></head>  <body> <br>  <h1>Wallet is empty . . . To Recharge , <a href='http://104.154.132.33:3000/'> Click Here. . .</a></h1></body>"
          );
          console.log("New User Please add a wallet");
        }
      }
    );

    console.log(JSON.stringify(savejeecoin, null, 4));
    //savejeecoin.addBlock(new Block(found[1], dateTime, { amount: 10 }));
  } else {
    // console.log("Invalid AADHAR no. " + found[1]);
    console.log("Invalid AADHAR no. " + aadhar);
  }
  // res.write("Submitted Succesfully");
});
app.listen(8001);