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

betterTimeout = (delay) => new Promise(r => setTimeout(r, delay));

test(`Adds additional x,y input fields`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);
    let inputFieldArrX = domTesting.getAllByLabelText(document, "X");
    let inputFieldArrY = domTesting.getAllByLabelText(document, "Y");

    // Assert initial input field count
    expect(inputFieldArrX.length).toBe(1);
    expect(inputFieldArrY.length).toBe(1);

    // Act
    await user.click(addValButton);
    inputFieldArrX = domTesting.getAllByLabelText(document, "X");
    inputFieldArrY = domTesting.getAllByLabelText(document, "Y");

    // Assert updated input field count
    expect(inputFieldArrX.length).toBe(2);
    expect(inputFieldArrY.length).toBe(2);
})
test(`Adding additional x,y input fields does not impact data`, async function(){
    // Arrange
    initDomFromFiles(`${__dirname}/line.html`, `${__dirname}/line.js`);
	const user = userEvent.setup();
    const addValButton = domTesting.getByText(document, `+`);
    let inputFieldX = domTesting.getByLabelText(document, "X");
    let inputFieldY = domTesting.getByLabelText(document, "Y");

    // Act
    await user.type(inputFieldX, "1");
    await user.type(inputFieldY, "2");
    await user.click(addValButton);
    await user.click(addValButton);
    await user.click(addValButton);
    
    // Assert
    expect(inputFieldX).toHaveValue(1);
    expect(inputFieldY).toHaveValue(2);
})
test(`Display alert for missing `, async function(){
    
})