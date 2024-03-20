/**
 * @jest-environment jsdom
 */

const fs = require("fs")
const domTesting = require("@testing-library/dom")
require("@testing-library/jest-dom")
//require("whatwg-fetch")
const userEvent = require("@testing-library/user-event").default

function initDomFromFiles(htmlPath, jsPath){
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function(){
        require(jsPath)
    })
}

const {saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData, loadCurrentChartData } = require('./chartStorage')

test('saveChart: Test that a chart is added correctly to local storage', function(){
    const chart = {data:[1,2,3]}
    const expectedCharts = [chart]
    
    saveChart(chart)
    const savedCharts = JSON.parse(localStorage.getItem("savedCharts"))
    
    expect(savedCharts).toEqual(expectedCharts)

    localStorage.clear()
});

test('saveChart: Test that multiple charts are added correctly to local storage', function(){
    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const expectedCharts = [chart1, chart2]
    
    saveChart(chart1)
    saveChart(chart2)
    const savedCharts = JSON.parse(localStorage.getItem("savedCharts"))
    
    expect(savedCharts).toEqual(expectedCharts)

    localStorage.clear()
});

test('saveChart: Test that a chart is overwritten correctly when an index inputted', function(){
    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const chart3 = {data:[7,8,9]}
    const expectedCharts = [chart3, chart2]
    
    saveChart(chart1)
    saveChart(chart2)
    saveChart(chart3, 0)
    const savedCharts = JSON.parse(localStorage.getItem("savedCharts"))
    
    expect(savedCharts).toEqual(expectedCharts)

    localStorage.clear()
});

test('loadAllSavedCharts: Test when there are no charts saved', function(){

    const expectedCharts = []
    
    expect(loadAllSavedCharts()).toEqual(expectedCharts)

    localStorage.clear()
});

test('loadAllSavedCharts: Test when there are charts saved', function(){

    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const chart3 = {data:[7,8,9]}
    const expectedCharts = [chart1, chart2, chart3]

    saveChart(chart1)
    saveChart(chart2)
    saveChart(chart3)
    
    expect(loadAllSavedCharts()).toEqual(expectedCharts)

    localStorage.clear()
});

test('loadSavedChart: Test index 0 when there are no charts saved', function(){
    
    expect(loadSavedChart(0)).toEqual({})

    localStorage.clear()
});

test('loadSavedChart: Test index 1 when there are no charts saved', function(){
    
    expect(loadSavedChart(1)).toEqual({})

    localStorage.clear()
});

test('loadSavedChart: Test indexes when there are 3 charts saved', function(){
    
    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const chart3 = {data:[7,8,9]}

    saveChart(chart1)
    saveChart(chart2)
    saveChart(chart3)

    expect(loadSavedChart(0)).toEqual(chart1)
    expect(loadSavedChart(1)).toEqual(chart2)
    expect(loadSavedChart(2)).toEqual(chart3)

    localStorage.clear()
});

test('updateCurrentChartData: Test that a current chart is added correctly to local storage', function(){
    const chart = {data:[1,2,3]}
    
    updateCurrentChartData(chart)    
    const currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    
    expect(currentChartData).toEqual(chart)

    localStorage.clear()
});

test('updateCurrentChartData: Test that multiple charts being added keeps track of the current chart', function(){
    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const chart3 = {data:[7,8,9]}
    
    updateCurrentChartData(chart1)
    let currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    expect(currentChartData).toEqual(chart1)

    updateCurrentChartData(chart2)
    currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    expect(currentChartData).toEqual(chart2)

    updateCurrentChartData(chart3)
    currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    expect(currentChartData).toEqual(chart3)

    localStorage.clear()
});

test('loadCurrentChartData: Test when there are no charts saved', function(){

    expect(loadCurrentChartData()).toEqual({})

    localStorage.clear()
});

test('loadCurrentChartData: Test that multiple charts keep track of current chart', function(){

    const chart1 = {data:[1,2,3]}
    const chart2 = {data:[4,5,6]}
    const chart3 = {data:[7,8,9]}
    
    updateCurrentChartData(chart1)
    expect(loadCurrentChartData()).toEqual(chart1)

    updateCurrentChartData(chart2)
    currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    expect(loadCurrentChartData()).toEqual(chart2)

    updateCurrentChartData(chart3)
    currentChartData = JSON.parse(localStorage.getItem("currentChartData"))
    expect(loadCurrentChartData()).toEqual(chart3)

    localStorage.clear()
});