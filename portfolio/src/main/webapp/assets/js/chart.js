google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/** Fetches US climbing participation data and uses it to create a chart. */
function drawChart() {
  fetch('/climbing-data').then(response => response.json())
  .then((climbingParticipation) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', 'Climbers');
    Object.keys(climbingParticipation).forEach((year) => {
      data.addRow([year, climbingParticipation[year]]);
    });

    const options = {
      'title': 'Climbing Participants',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.LineChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}