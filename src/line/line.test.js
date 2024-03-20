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
    jest.isolateModules(function(){
        require(jsPath)
    })
}

beforeEach(function(){
    window.localStorage.clear();
});

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
test(`Clearing chart data clears all input fields`, async function(){
    // 
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
test(`Clearing chart data deletes chart`, async function(){
    // 
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const genChartButton = domTesting.getByText(document, "Generate chart");
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
    await user.click(genChartButton);
    await user.click(clearChartButton);

    // Assert
    expect(domTesting.queryByRole(document, 'img')).toBe(null);
});
test(`Clearing chart data clears all but one input field`, async function(){
    // 
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);
    const clearChartButton = domTesting.getByText(document, "Clear chart data");
    
    
    // Act
    await user.click(addValButton);
    await user.click(clearChartButton);

    // Assert
    let inputFieldArrX = domTesting.getAllByLabelText(document, "X");
    let inputFieldArrY = domTesting.getAllByLabelText(document, "Y");
    expect(inputFieldArrX.length).toBe(1);
    expect(inputFieldArrY.length).toBe(1);
});