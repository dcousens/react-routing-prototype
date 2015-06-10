let React = require('react')

let View = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    component: React.PropTypes.element.isRequired,
    viewProps: React.PropTypes.object
  },

  childContextTypes: { viewName: React.PropTypes.string.isRequired },
  getChildContext () { return { viewName: this.props.name } },

  render () {
    let { name, component: ViewComponent, viewProps } = this.props
    let viewClassName = 'View View--' + name

    return <ViewComponent className={viewClassName} { ... viewProps } />
  }
})

module.exports = View
