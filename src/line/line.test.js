/**
 * @jest-environment jsdom
 */

const fs = require("fs")
const domTesting = require("@testing-library/dom")
require("@testing-library/jest-dom")
require("whatwg-fetch")
const userEvent = require("@testing-library/user-event").default

function initDomFromFiles(htmlPath, jsPath){
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()

    require(jsPath);
    //jest.isolateModules(function(){require(jsPath)});
}


beforeEach(function(){
    window.localStorage.clear();
    jest.resetModules();
});


//--------------------------------------------------
//-- Test 1
test(`Adds additional x,y input fields`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);

    // Act
    await user.click(addValButton);  

    // Assert
    let inputFieldArrX = domTesting.getAllByLabelText(document, "X");
    let inputFieldArrY = domTesting.getAllByLabelText(document, "Y");
    expect(inputFieldArrX.length).toBe(2);
    expect(inputFieldArrY.length).toBe(2);
});


//--------------------------------------------------
//-- Test 2
test(`Adding additional x,y input fields does not impact data`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);
    const inputFieldX = domTesting.getByLabelText(document, "X");
    const inputFieldY = domTesting.getByLabelText(document, "Y");

    // Act
    await user.type(inputFieldX, "1");
    await user.type(inputFieldY, "2");
    await user.click(addValButton);
    await user.click(addValButton);
    await user.click(addValButton);
    
    // Assert
    expect(inputFieldX).toHaveValue(1);
    expect(inputFieldY).toHaveValue(2);
});


//--------------------------------------------------
//-- Test 3
test(`Display alert for missing data values`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const genChartButton = domTesting.getByText(document, "Generate chart");
    const labelX = domTesting.getByLabelText(document, "X label");
    const labelY = domTesting.getByLabelText(document, "Y label");
    const alertSpy = jest.spyOn(window, "alert");

    // Act
    await user.type(labelX, "Year");
    await user.type(labelY, "Population");
    await user.click(genChartButton);

    // Assert
    expect(alertSpy).toHaveBeenCalledTimes(1);
    const alertMessage = alertSpy.mock.calls[0][0]
    expect(alertMessage).toBe("Error: No data specified!")

    alertSpy.mockRestore()
});


//--------------------------------------------------
//-- Test 4
test(`Display alert for missing axis labels`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const genChartButton = domTesting.getByText(document, "Generate chart");
    const inputFieldX = domTesting.getByLabelText(document, "X");
    const inputFieldY = domTesting.getByLabelText(document, "Y");
    const alertSpy = jest.spyOn(window, "alert");

    // Act
    await user.type(inputFieldX, "1");
    await user.type(inputFieldY, "2");
    await user.click(genChartButton);

    // Assert
    expect(alertSpy).toHaveBeenCalledTimes(1);
    const alertMessage = alertSpy.mock.calls[0][0]
    expect(alertMessage).toBe("Error: Must specify a label for both X and Y!")

    alertSpy.mockRestore()
});


//--------------------------------------------------
//-- Test 5
test(`Clearing chart data clears all input fields`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const clearChartButton = domTesting.getByText(document, "Clear chart data");
    let chartTitle = domTesting.getByLabelText(document, "Chart title");
    let labelX = domTesting.getByLabelText(document, "X label");
    let labelY = domTesting.getByLabelText(document, "Y label");
    let inputFieldX = domTesting.getByLabelText(document, "X");
    let inputFieldY = domTesting.getByLabelText(document, "Y");

    // Act
    await user.type(chartTitle, "US Population");
    await user.type(labelX, "Year");
    await user.type(labelY, "Population");
    await user.type(inputFieldX, "2023");
    await user.type(inputFieldY, "335888625");
    await user.click(clearChartButton);

    // Assert
    chartTitle = domTesting.getByLabelText(document, "Chart title");
    labelX = domTesting.getByLabelText(document, "X label");
    labelY = domTesting.getByLabelText(document, "Y label");
    inputFieldX = domTesting.getByLabelText(document, "X");
    inputFieldY = domTesting.getByLabelText(document, "Y");
    await expect(chartTitle.value).toBe("");
    await expect(labelX.value).toBe("");
    await expect(labelY.value).toBe("");
    await expect(inputFieldX.value).toBe("");
    await expect(inputFieldY.value).toBe("");
});


//--------------------------------------------------
//-- Test 6
test(`Clearing chart data deletes chart`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    let chartTitle = domTesting.getByLabelText(document, "Chart title");
    let labelX = domTesting.getByLabelText(document, "X label");
    let labelY = domTesting.getByLabelText(document, "Y label");
    let inputFieldX = domTesting.getByLabelText(document, "X");
    let inputFieldY = domTesting.getByLabelText(document, "Y");
    const genChartButton = domTesting.getByText(document, "Generate chart");
    const clearChartButton = domTesting.getByText(document, "Clear chart data");

    // Act
    await user.type(chartTitle, "US Population");
    await user.type(labelX, "Year");
    await user.type(labelY, "Population");
    await user.type(inputFieldX, "2023");
    await user.type(inputFieldY, "335888625");
    await user.click(genChartButton);
    //let thing = domTesting.getByRole(document, 'img');
    //expect(thing).not.toBe(null);
    await user.click(clearChartButton);

    // Assert
    expect(domTesting.queryByRole(document, 'img')).toBe(null);
});


//--------------------------------------------------
//-- Test 7
test(`Clearing chart data deletes all but one x,y input field`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);
    const clearChartButton = domTesting.getByText(document, "Clear chart data");
    
    // Act
    await user.click(addValButton);
    await user.click(addValButton);
    await user.click(addValButton);
    await user.click(clearChartButton);

    // Assert
    let inputFieldArrX = domTesting.getAllByLabelText(document, "X");
    let inputFieldArrY = domTesting.getAllByLabelText(document, "Y");
    expect(inputFieldArrX.length).toBe(1);
    expect(inputFieldArrY.length).toBe(1);
});


//--------------------------------------------------
//-- Test 8
test(`Data is correctly sent ot chart generation function`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();

    jest.mock("../lib/generateChartImg.js")
    const spy = require("../lib/generateChartImg.js")

    let chartTitle = domTesting.getByLabelText(document, "Chart title");
    let labelX = domTesting.getByLabelText(document, "X label");
    let labelY = domTesting.getByLabelText(document, "Y label");
    let inputFieldX = domTesting.getByLabelText(document, "X");
    let inputFieldY = domTesting.getByLabelText(document, "Y");
    const genChartButton = domTesting.getByText(document, "Generate chart");
    const clearChartButton = domTesting.getByText(document, "Clear chart data");

    // Act
    await user.type(chartTitle, "US Population");
    await user.type(labelX, "Year");
    await user.type(labelY, "Population");
    await user.type(inputFieldX, "2023");
    await user.type(inputFieldY, "335888625");
    await user.click(genChartButton);


    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    const type = spy.mock.calls[0][0];
    expect(type).toBe("line");
    const dataPoint = spy.mock.calls[0][1][0];
    expect(dataPoint["x"]).toBe("2023");
    expect(dataPoint["y"]).toBe("335888625");
    const xLabel = spy.mock.calls[0][2];
    expect(xLabel).toBe("Year");
    const yLabel = spy.mock.calls[0][3];
    expect(yLabel).toBe("Population");
    const title = spy.mock.calls[0][4];
    expect(title).toBe("US Population");
    const color = spy.mock.calls[0][5];
    expect(color).toBe("#ff4500");

    spy.mockRestore();
});