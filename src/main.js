
// XML
import XMLParser from 'fast-xml-parser';
import xml2json from 'xml2json';

// Graphiques
import Chart from 'chart.js/auto';
//import { ChartHelpers } from 'chart.js/helpers';

// Glisser-déposer
//import { Dropzone } from 'dropzone';

// Périodes du calendrier tirées des annexes des ordonnances
import * as quota_periods from './quota_periods.json';

console.log(quota_periods);

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'bar',
    data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 0
    }]
    }
});

function isWithin(date) {
    
}

var parser = XMLParser();
let json = parser.parse("<rsm:Observation><rsm:Position><rsm:Sequence>3</rsm:Sequence></rsm:Position><rsm:Volume>11357</rsm:Volume><rsm:Condition>56</rsm:Condition></rsm:Observation>");

console.log(json);


xml2json.toJson("<rsm:Observation><rsm:Position><rsm:Sequence>3</rsm:Sequence></rsm:Position><rsm:Volume>11357</rsm:Volume><rsm:Condition>56</rsm:Condition></rsm:Observation>", function(err, result) {
    console.log(result);
});