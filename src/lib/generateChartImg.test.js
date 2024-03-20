/**
* @jest-environment ./src/fixjsdomenvironment.js
*/


require("whatwg-fetch")

const generateChartImg = require('./generateChartImg')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('Test that a url is returned when given all correct inputs', async function(){
    
    const type = "bar"
    const data = [{x:2,y:3},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const xLabel = "Test X Label"
    const yLabel = "Test Y Label"
    const title = "Title"
    const color = "blue"
    //const title = null
    //const color = null
    const imgUrl = await generateChartImg(type, data, xLabel, yLabel, title, color)

    expect(imgUrl).toContain("blob:nodedata:")
    
});

test('Test that a url is returned when given blank title and color', async function(){
    
    const type = "bar"
    const data = [{x:2,y:3},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const xLabel = "Test X Label"
    const yLabel = "Test Y Label"
    const title = null
    const color = null

    const imgUrl = await generateChartImg(type, data, xLabel, yLabel, title, color)

    expect(imgUrl).toContain("blob:nodedata:")
    
});

test('Test that a url is returned when given no a color Hex title or color', async function(){
    
    const type = "bar"
    const data = [{x:2,y:3},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const xLabel = "Test X Label"
    const yLabel = "Test Y Label"
    const title = "Title"
    const colorHex = "42e3f5"

    const imgUrl = await generateChartImg(type, data, xLabel, yLabel, title, colorHex)

    expect(imgUrl).toContain("blob:nodedata:")
    
});