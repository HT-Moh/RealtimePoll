const form = document.getElementById('vote-form');
form.addEventListener('submit', (e) => {
    const choice  = document.querySelector('input[name=euteam]:checked').id;
    const data = {euteam: choice};
    fetch('http://127.0.0.1:3000/poll',{
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'content-Type': 'application/json'
      })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    refreshUI();
    e.preventDefault();
});

const refreshUI = () => {fetch('http://127.0.0.1:3000/poll')
.then(res => res.json())
.then(data => {
   //console.log(data);
   const votes = data.votes;
   const totalVotes = votes.length;
   const voteCounts = votes.reduce(
          (acc, vote) =>
          ((acc[vote.euteam.trim().toLowerCase()] = (acc[vote.euteam.trim().toLowerCase()] || 0) + parseInt(vote.points))
          ,acc), {});

   let dataPoints = [
       { label: 'Real madrid', y: voteCounts.realmadrid},
       { label: 'FC Barcelona', y: voteCounts.fcbarcelona},
       { label: 'FC Bayern München', y: voteCounts.fcBayernmünchen},
       { label: 'Manchester City FC', y: voteCounts.manchestercityfc},
       { label: 'Arsenal FC', y: voteCounts.arsenalfc},
       { label: 'Manchester United FC', y: voteCounts.manchesterunitedfC},
       { label: 'Olympique de Marseille', y: voteCounts.olympiquedemarseille},
       { label: 'PSV Eindhoven', y: voteCounts.psveindhoven},
   ];

   const chartcontainer = document.querySelector('#chartcontainer');
   if(chartcontainer) {
     const chart = new CanvasJS.Chart('chartcontainer',{
       animationEnabled: true,
       theme: 'theme1',
       title: {
         text: `Football vote results ${totalVotes}`
       },
       data:[
         {
           type:'column',
           dataPoints: dataPoints
         }
       ]
     });
     chart.render();
     Pusher.logToConsole = true;

     var pusher = new Pusher('e4d438c4862b4333efbd', {
       cluster: 'eu',
       encrypted: true
     });

     var channel = pusher.subscribe('os-poll');
     channel.bind('os-vote', function(data) {
         dataPoints = dataPoints.map(x => {
           if(x.label == data.euteam){
             x.y += data.points;
             return x;
           }
           else {
             return x;
           }
         });
         chart.render();
     });
   }
 });
}
 refreshUI();
