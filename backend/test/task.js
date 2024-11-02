let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

chai.should();

chai.use(chaiHttp);

describe("Tasks API", function () {
  this.timeout(10000);

  before(function (done) {
    if (mongoose.connection.readyState === 1) {
      done();
    } else {
      mongoose.connection.once("open", done);
      mongoose.connection.on("error", done);
    }
  });

  describe("GET /api/v1/users/fetchapplications", () => {
    it("IT SHOULD RETURN ALL THE APPLICATIONS", (done) => {
      // const task = {
      //     email:'shaangzb@gmail.com',
      //     password:'123',

      // };




      describe("GET /api/v1/users/", () => {
        it("IT SHOULD RETURN ALL THE JOBS", (done) => {
          // const task = {
          //     email:'shaangzb@gmail.com',
          //     password:'123',

          // };

          chai
            .request("http://localhost:8000")
            .get("/api/v1/users/")

            .end((err, response) => {
              response.body.should.be.a("object");

              console.log("*********", response.body);

              done();
            });
        });
      });

      describe("POST /api/v1/users/createjob", () => {
        it("IT SHOULD RETURN THE JOB", (done) => {
          const body = {
            name: "Shaan",
            managerid: "1234556",
            skills: "C,java",
            location: "Noida",
            description: "xyz",
            pay: "10",
            schedule: "10/10/10",
          };
          done();
        });
      });
    });


  });
});