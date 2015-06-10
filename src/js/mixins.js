let React = require('react')

let reverseTransitions = require('./transitions')

let Routing = {
  contextTypes: {
    viewController: React.PropTypes.object.isRequired,
    viewName: React.PropTypes.string
  },

  getBasePath () {
    return this.context.viewController.getPath()
  },

  getViewPath () {
    return this.getBasePath() + '/' + this.context.viewName
  },

  transitionTo (targetPath, targetProps, transition) {
    transition = transition || 'view-transition-instant'

    let { viewController } = this.context
    viewController.transitionTo(targetPath, targetProps, transition)
  },

  transitionToWithHistory (targetPath, targetProps, transition) {
    let actualProps = Object.assign({
      previousView: this.getViewPath(),
      previousViewProps: this.props,
      previousTransition: transition
    }, targetProps)

    this.transitionTo(targetPath, actualProps, transition)
  },

  transitionToLocal (targetPath, ... args) {
    let actualPath = this.getBasePath()

    if (targetPath) {
      actualPath += '/' + targetPath
    }

    this.transitionTo(actualPath, ... args)
  },

  transitionToLocalWithHistory (targetPath, ... args) {
    let actualPath = this.getBasePath()

    if (targetPath) {
      actualPath += '/' + targetPath
    }

    this.transitionToWithHistory(actualPath, ... args)
  }
}

let History = {
  propTypes: {
    previousView: React.PropTypes.string.isRequired,
    previousViewProps: React.PropTypes.object.isRequired,
    previousTransition: React.PropTypes.string
  },

  gotoPreviousView () {
    let {
      previousView,
      previousViewProps,
      previousTransition
    } = this.props

    let actualTransition = reverseTransitions[previousTransition] || previousTransition
    this.transitionTo(previousView, previousViewProps, actualTransition)
  }
}

module.exports = {
  History: History,
  Routing: Routing
}
