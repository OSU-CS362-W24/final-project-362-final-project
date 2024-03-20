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
    let inputFieldArr = domTesting.getAllByLabelText(document, "X");

    // Act & Assert
    expect(inputFieldArr.length).toBe(1);
    await user.click(addValButton);
    inputFieldArr = domTesting.getAllByLabelText(document, "X");
    expect(inputFieldArr.length).toBe(2);
})