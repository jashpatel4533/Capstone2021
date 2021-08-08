const brain = require('brain.js/src');
const csvData= require('./mltest.csv');
const d3 = require('d3-fetch');
export const net= new brain.NeuralNetwork();

const test=[];
var trainedData;
  function trainML(){
 d3.csv(csvData).then((data) => {
        //const net = new brain.NeuralNetwork();
       let x=[];
       let y=[];


        data.map(function(dt){
        x.push([dt.length_url,
          dt.length_hostname, 
          dt.ip,
          dt.nb_dots,
          dt.nb_hyphens  ,
          dt.nb_at ,
          dt.nb_qm ,
          dt.nb_and  ,
          dt.nb_or ,
          dt.nb_eq ,
          dt.nb_underscore ,
          dt.nb_tilde  ,
          dt.nb_percent  ,
          dt.nb_slash  ,
          dt.nb_star ,
          dt.nb_colon  ,
          dt.nb_comma  ,
          dt.nb_semicolumn ,
          dt.nb_dollar ,
          dt.nb_space  ,
          dt.nb_www ,
          dt.nb_com  ,
          dt.nb_dslash ,
          dt.http_in_path  ,
          dt.https_token ,
          dt.nb_hyperlinks,
          dt.submit_email  ,
          dt.safe_anchor]);


        y.push([dt.status]);
         });
                       //console.log((x[0]));
                    // console.log(y);
          var elm;
            

          for (elm=0; elm<200;elm++){
          test.push({ input: x[elm], output: y[elm] });

           }
           console.log(test);
           net.train(test);
           //console.log(net);
    });

}
trainML();
