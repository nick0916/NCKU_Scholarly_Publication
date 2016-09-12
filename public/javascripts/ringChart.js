$(function () {

    var colors = ['rgb(255, 255, 255)', 'rgb(204, 204, 204)', 'rgb(153, 153, 153)', 'rgb(128, 128, 128)', 'rgb(77, 77, 77)', 'rgb(51, 51, 51)'],
        categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
        data = [{
            y: 36.33,
            color: colors[0],
            drilldown: {
                name: 'MSIE versions',
                categories: ['catagory1'],
                data: [36.33],
                color: colors[0]
            }
        }, {
            y: 10.38,
            color: colors[1],
            drilldown: {
                name: 'Firefox versions',
                categories: ['catagory2'],
                data: [10.38],
                color: colors[1]
            }
        }, {
            y: 20.03,
            color: colors[2],
            drilldown: {
                name: 'Chrome versions',
                categories: ['catagory3'],
                data: [20.03],
                color: colors[2]
            }
        }, {
            y: 8.77,
            color: colors[3],
            drilldown: {
                name: 'Safari versions',
                categories: ['catagory4'],
                data: [8.77],
                color: colors[3]
            }
        }, {
            y: 10.91,
            color: colors[4],
            drilldown: {
                name: 'Opera versions',
                categories: ['catagory5'],
                data: [10.91],
                color: colors[4]
            }
        }, {
            y: 10.2,
            color: colors[5],
            drilldown: {
                name: 'Proprietary or Undetectable',
                categories: ['catagory6'],
                data: [20.2],
                color: colors[5]
            }
        }],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    $('#ringChart').highcharts({
        chart: {
            type: 'pie',
            backgroundColor: '#081F3D',
        },
        title: {
            text: ''
        },
        credits: {
            text: '',
        },
        exporting:{enabled: false},
        subtitle: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            },
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                borderColor: '#081F3D'
            },
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                dataLabels:{enabled:false}
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: [{
            name: 'Browsers',
            data: browserData,
            visible: false,
            size: '30%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            name: 'total',
            data: versionsData,
            size: '110%',
            innerSize: '77%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                }
            }
        }]
    });
});