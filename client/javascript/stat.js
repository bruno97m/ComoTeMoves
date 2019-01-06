  //Estatisticas Tab with googlecharts

        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            $.getJSON('http://localhost:3000/getEstatisticas1', function(data) {
                console.log(data);
                var items = [
                    ['Age', 'Number']
                ];
                for (item in data) {
                    var i = [data[item].Age, parseInt(data[item].Number)];
                    items.push(i);
                }
                var dataTable = google.visualization.arrayToDataTable(items);
                var options = {
                    title: 'Transporte por Faixa Etária',
                    width: 600,
                    height: 500
                };

                var chart = new google.visualization.BarChart(document.getElementById('estatisticas1'));

                chart.draw(dataTable, options);

            });

            //------------------------------------------------------

            $.getJSON('http://localhost:3000/getEstatisticas2', function(data) {
                var items = [
                    ['Tranport', 'Number']
                ];
                for (item in data) {
                    var i = [data[item].Transport, parseInt(data[item].Number)];
                    console.log(i);
                    items.push(i);
                }
                var dataTable = google.visualization.arrayToDataTable(items);
                var options = {
                    title: 'Percentagem de uso de tipo de transporte',
                    width: 600,
                    height: 500
                };

                var chart = new google.visualization.PieChart(document.getElementById('estatisticas2'));
                chart.draw(dataTable, options);


            });

            //---------------------------------------------------------------------------------------------------

            $.getJSON('http://localhost:3000/getEstatisticas3', function(data) {
                var items = [
                    ['Hour', 'Number']
                ];
                for (item in data) {
                    var i = [data[item].Hour, parseInt(data[item].Number)];
                    console.log(i);
                    items.push(i);
                }
                var dataTable = google.visualization.arrayToDataTable(items);
                var options = {
                    title: 'Uso de transportes por hora',
                    width: 900,
                    height: 500
                };

                var chart = new google.visualization.LineChart(document.getElementById('estatisticas3'));
                chart.draw(dataTable, options);

            });
        }
