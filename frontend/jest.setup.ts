import "@testing-library/jest-dom"

jest.mock("lucide-react", () => {
  const React = require("react")
  return new Proxy(
    {},
    {
      get: (_, name) => (props: Record<string, unknown> = {}) =>
        React.createElement("svg", { "data-icon": String(name), ...props }),
    },
  )
})
