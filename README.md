# Demo: shared header component

To avoid flickering when going from one screen to another in a single-page app, it is useful to try and keep as much of the DOM intact as possible, basically common hierarcies, especially if a sub-tree is moderately expensive to render. One such example could be a `<Header>` component in an app: shared by many, but is on the outside of each screen for performance. [Stack overflow question on this topic](https://stackoverflow.com/q/47196930/200987).

There are two issues that is interesting to ponder:
1. How can we dynamically update the header along with the screen component - which is rendered elsewhere?
2. How can we pass event handlers to the header when it is located further up the hierarcy?

This demo tries to answer how to do both of these things. The first issue is basically solved using React Router: by having a router section in the header as well as in the screen component, we can update them both in sync with changes in the url. The problem of event handlers involves a bit more thinking, but is quite easy to solve in practice: we pass an object into both DOM hierarcies and mutate it to set new event handlers. The interface of such a shared object could be as simple as props we set a la `obj.myHandler = fooMyHandler`, but in our demo we have been a bit more fancy, ensuring the event handler name is recognized and that it actually expects an event as the parameter.

## Try it out
`npm start`
