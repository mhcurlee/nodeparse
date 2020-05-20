const Handlebars = require('handlebars');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');


const app = express();
const port = 8080;





app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>  {
  
  res.send(`
    <html>
    <head><title>OpenShift New Project parser</title>
    </head>
    <body></body>
    <h1>OpenShift Project Parser</h1>
    <br>
    <form action="/output" method="post">
    JSON data: <br>
    <textarea id="project_data" rows="10" cols="75" name="project_data"></textarea>
    <br><br>
    <input type="submit" value="Parse Data">
   </form>
   </body>
   </html>
  
  `);

});





app.post('/output', (req, res) => {
// parse inbound json data
 
 let templateFile;
 let templateData;

 // define needed vars in new Object
 let templateObject = {
   firstName: "",
   age: "",
   env: ""
 };

// read json data from html body
 const project_data = req.body.project_data;
 const parsedData = JSON.parse(project_data);

// assign values to object properties
 templateObject.firstName = parsedData.firstName.toLowerCase();
 templateObject.age = parsedData.age
 templateObject.env = parsedData.env.toLowerCase();


 // select proper template file
 if ( parsedData.env === "prod") {
   templateFile = './prod.yaml';
 }
  else {
   templateFile = './np.yaml';
  }

// read template file

  try {
    templateData = fs.readFileSync(templateFile, 'utf8');
   } catch (err) {
    console.error(err);
  }


// process handlebars template and return yaml data

  let template = Handlebars.compile(templateData);
  const result = template(templateObject);
  res.send(`
  <html>
    <head><title>OpenShift New Project parser</title>
    </head>
    <body></body>
    <h1>OpenShift Project Parser</h1>
    <br>
    YAML data: <br>
    <textarea id="project_data" rows="40" cols="75" name="project_data">${result}</textarea>
    <br><br>
    <input type="submit" value="Parse Data">
   </form>
   </body>
   </html>
  
  `);

});







app.listen(port, () => console.log(`Listening on port: ${port}`));