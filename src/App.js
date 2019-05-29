import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React from "react";
import logo from "./logo.svg";
import "./App.css";

// This object exposes the header event handler API and
// can be passed down to sub-components to change what will
// happen in the header when that component has been mounted
const headerController = (() => {
  // our list of handlers
  const handlers = {
    handleButtonClick() {},
    handleInputFocus() {}
  };

  // the api we will expose to our clients; a setter (used by the non-header-components) and the handlers (used by the header)
  const api = {
    setEventHandler(name, fn) {
      if (!fn || fn.length < 1) {
        throw new TypeError(
          "An event handler needs to be supplied: function(event) {...}"
        );
      }

      if (!(name in handlers)) {
        throw new TypeError("Unknown event handler supplied");
      }

      handlers[name] = fn;
    }
  };

  // expose our handlers, but use a layer in-between
  // This is to make it possible to directly reference a handler in the components
  // while at the same time being sure that a change in the handler config will be reflected
  for (const handler of Object.keys(handlers)) {
    api[handler] = e => handlers[handler](e);
  }

  // Ensure no mutation will take place
  return Object.freeze(api);
})();

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Header controls={headerController} />
        <Route path="/bar" render={() => <Bar controls={headerController} />} />
        <Route path="/foo" render={() => <Foo controls={headerController} />} />
        <Route path="/" exact render={() => <Link to="/bar">Go to bar</Link>} />
      </Router>
      <p>This is the end, my friend</p>
    </div>
  );
}

function Header({ controls: c }) {
  return (
    <header className="App-header">
      <Link to="/">
        <img src={logo} className="App-logo" alt="logo" />
      </Link>
      <Route
        path="/bar"
        render={() => (
          <p>
            BarHeader
            <button onClick={c.handleButtonClick}>Click me!</button>
          </p>
        )}
      />
      <Route
        path="/foo"
        render={() => (
          <>
            <p>FooHeader</p>
            <input onFocus={e => c.handleInputFocus(e)} />
          </>
        )}
      />
      <Route path="/" exact render={() => `La-${"la-".repeat(10)}la`} />
    </header>
  );
}

class Bar extends React.PureComponent {
  constructor(props) {
    super(props);
    const { setEventHandler } = props.controls;

    setEventHandler("handleButtonClick", event => {
      alert("This is Barta!");
      event.preventDefault();
    });
    setEventHandler("handleInputFocus", event => {
      event.preventDefault();
    });
  }

  render() {
    return <Link to="/foo">Please focus!", said the Bar-tender</Link>;
  }
}

let size = 10;
let addToggle = true;
function Foo(props) {
  const { setEventHandler } = props.controls;

  setEventHandler("handleInputFocus", event => {
    const inputField = event.target;
    inputField.value = "A Fooz pedal!";
    inputField.style.border = "dashed 3px green";

    // increase the font size on every event
    const makeBig = e => {
      size = addToggle ? size + 10 : size - 10;
      e.target.style.fontSize = size + "px";

      if (size > 50) addToggle = false;
      if (size < 11) addToggle = true;
    };

    const removeMakeBig = () => {
      inputField.removeEventListener("keyup", makeBig);
    };

    inputField.addEventListener("keyup", makeBig);
    inputField.addEventListener("blur", removeMakeBig, { once: true }); // auto-cleanup
  });

  return <Link to="/">"I AM focused!", said the Foo-baller</Link>;
}

export default App;
