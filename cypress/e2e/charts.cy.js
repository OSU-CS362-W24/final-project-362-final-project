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
  cy.get("#chart-display").should("exist");
});

it("maintains data across pages", () => {
  cy.visit("/");
  cy.findByRole("link", { name: "Line" }).click();
  cy.url().should("contain", "/line.html");
  cy.findByRole("textbox", { name: "Chart title" }).type("test");
  cy.findByRole("textbox", { name: "X label" }).type("test x");
  cy.findByRole("textbox", { name: "Y label" }).type("test y");
  cy.findByRole("spinbutton", { name: "X" }).type("4");
  cy.findByRole("spinbutton", { name: "Y" }).type("10");

  cy.findByRole("link", { name: "Scatter" }).click();
  cy.url().should("contain", "/scatter.html");
  cy.findByRole("textbox", { name: "Chart title" }).should(
    "have.value",
    "test",
  );
  cy.findByRole("textbox", { name: "X label" }).should("have.value", "test x");
  cy.findByRole("textbox", { name: "Y label" }).should("have.value", "test y");
  cy.findAllByRole("spinbutton", { name: "X" }).eq(0).should("have.value", "4");
  cy.findAllByRole("spinbutton", { name: "Y" })
    .eq(0)
    .should("have.value", "10");

  cy.findByRole("link", { name: "Bar" }).click();
  cy.url().should("contain", "/bar.html");
  cy.findByRole("textbox", { name: "Chart title" }).should(
    "have.value",
    "test",
  );
  cy.findByRole("textbox", { name: "X label" }).should("have.value", "test x");
  cy.findByRole("textbox", { name: "Y label" }).should("have.value", "test y");
  cy.findAllByRole("textbox", { name: "X" }).eq(0).should("have.value", "4");
  cy.findAllByRole("spinbutton", { name: "Y" })
    .eq(0)
    .should("have.value", "10");
});

it("saves a chart to the gallery", () => {
  cy.visit("/");
  cy.findByRole("link", { name: "Line" }).click();
  cy.url().should("contain", "/line.html");
  cy.findByRole("textbox", { name: "Chart title" }).type("test line");
  cy.findByRole("textbox", { name: "X label" }).type("test x");
  cy.findByRole("textbox", { name: "Y label" }).type("test y");
  cy.findByRole("spinbutton", { name: "X" }).type("4");
  cy.findByRole("spinbutton", { name: "Y" }).type("10");

  cy.findByRole("button", { name: "Generate chart" }).click();
  cy.findByRole("button", { name: "Save chart" }).click();
  cy.get("#chart-display").should("exist");
  cy.findByRole("link", { name: "Gallery" }).click();
  cy.url().should("equal", "http://localhost:8080/");
  cy.get("#gallery").should("contain", "test line");

  cy.findByRole("link", { name: "Scatter" }).click();
  cy.url().should("contain", "/scatter.html");
  cy.findByRole("textbox", { name: "Chart title" })
    .clear()
    .type("test scatter");
  cy.findByRole("button", { name: "Generate chart" }).click();
  cy.findByRole("button", { name: "Save chart" }).click();
  cy.get("#chart-display").should("exist");
  cy.findByRole("link", { name: "Gallery" }).click();
  cy.url().should("equal", "http://localhost:8080/");
  cy.get("#gallery").should("contain", "test scatter");

  cy.findByRole("link", { name: "Bar" }).click();
  cy.url().should("contain", "/bar.html");
  cy.findByRole("textbox", { name: "Chart title" }).clear().type("test bar");
  cy.findByRole("button", { name: "Generate chart" }).click();
  cy.findByRole("button", { name: "Save chart" }).click();
  cy.get("#chart-display").should("exist");
  cy.findByRole("link", { name: "Gallery" }).click();
  cy.url().should("equal", "http://localhost:8080/");
  cy.get("#gallery").should("contain", "test bar");
});

it("opens saved chart and reloads data", () => {
  cy.visit("/");
  cy.findByRole("link", { name: "Line" }).click();
  cy.url().should("contain", "/line.html");
  cy.findByRole("textbox", { name: "Chart title" }).type("test line");
  cy.findByRole("textbox", { name: "X label" }).type("test x");
  cy.findByRole("textbox", { name: "Y label" }).type("test y");
  cy.findByRole("spinbutton", { name: "X" }).type("4");
  cy.findByRole("spinbutton", { name: "Y" }).type("10");

  cy.findByRole("button", { name: "Generate chart" }).click();
  cy.findByRole("button", { name: "Save chart" }).click();
  cy.get("#chart-display").should("exist");
  cy.findByRole("link", { name: "Gallery" }).click();
  cy.url().should("equal", "http://localhost:8080/");
  cy.get("#gallery").should("contain", "test line");

  cy.get("#gallery").find("chart.img").click();
});
