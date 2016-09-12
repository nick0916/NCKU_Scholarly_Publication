$(function () {
    Highcharts.setOptions({
        colors: ['#888888', '#FFFFFF', '#85a3a6']
    });
    $('#stakedBar').highcharts({
        chart: {
            type: 'column',
            backgroundColor: '#081F3D',
        },
        credits: {
            text: '',
        },
        title: {
            text: ''
        },
        exporting:{enabled: false},
        xAxis: {
            categories: ['2002', '2003', '2004', '2005','2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
            labels: {
                enabled: false,
            },
            showFirstLabel: true,
            showLastLabel: true,

        },
        yAxis: {
            gridLineColor: '#545454',
            min: 0,
            title: {
                text: ''
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'left',
            x: 0,
            verticalAlign: 'bottom',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',

        },
        plotOptions: {
            series: {
                borderWidth: 0
            },
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                },
                
            }
        },
        series: [{
            name: 'Papers',
            data: [2, 2, 3, 2, 1, 5, 3, 4, 7, 2, 6, 2, 3, 8]

        }, {
            name: 'Journals',
            data: [5, 3, 4, 7, 2, 6, 2, 8, 5, 6, 11, 2, 3, 1]
        }  
        ]
    });
});