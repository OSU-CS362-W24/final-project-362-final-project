it("generates charts correctly", () => {
  cy.visit("/");
  cy.findByRole("link", { name: "Line" }).click();
  cy.url().should("contain", "/line.html");
  cy.findByRole("textbox", { name: "Chart title" }).type("test");
  cy.findByRole("textbox", { name: "X label" }).type("test x");
  cy.findByRole("textbox", { name: "Y label" }).type("test y");
  cy.findByRole("spinbutton", { name: "X" }).type("4");
  cy.findByRole("spinbutton", { name: "Y" }).type("10");
  cy.findByRole("button", { name: "Generate chart" }).click();
  cy.get("#chart-display").should("contain", '<img id="chart-img"');
});
