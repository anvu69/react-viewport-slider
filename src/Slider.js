'use strict'

import PropTypes from 'prop-types'

import React, { Component } from 'react'

import Item from './Item'
import Paginator from './Paginator'
import scrollToY from 'scroll-to-y'
import WheelReact from 'wheel-react'

export default class Slider extends Component {
  constructor (props) {
    super(props)

    this.state = {
      refLength: 0,
      activeIndex: 1
    }

    this.setActive = this.setActive.bind(this)
    this.scrollUp = this.scrollUp.bind(this)
    this.scrollDown = this.scrollDown.bind(this)
    // this.handleScroll = this.handleScroll.bind(this)
    //this.lastScroll = 0

    WheelReact.config({
      left: () => {
        this.setState({
          content: 'left direction detected.'
        })
      },
      right: () => {
        this.setState({
          content: 'right direction detected.'
        })
      },
      up: () => {
        // this.setState({
        //   content: 'up direction detected.'
        // })
        console.log('upppppp')
        this.scrollUp()
      },
      down: () => {
        console.log('downnnnnn')
        this.scrollDown()
        // this.setState({
        //   content: 'down direction detected.'
        // })
      }
    })
    window.addEventListener('scroll', this.handleScroll);
  }

  scrollUp(){
    console.log('upppppp111111')
    console.log(this.state.activeIndex)
    if(this.state.activeIndex !== 1){
      const activeIndex = this.state.activeIndex - 1
      this.setActive(activeIndex, true)
      this.setState({activeIndex: activeIndex})
    }
  }

  scrollDown(){
    console.log('downnnnnn11111')
    console.log(this.state.activeIndex)
    console.log(this.refs)
    if(this.state.activeIndex !== Object.keys(this.refs).length) {
      const activeIndex = this.state.activeIndex + 1
      this.setActive(activeIndex, true)
      this.setState({activeIndex: activeIndex})
    }
  }

// componentWillUnmount() {
//   window.removeEventListener('scroll', this.handleScroll);
// }

// handleScroll() {
//   if (this.isAnimating) {
//     return;
//   }
//   const { activeIndex } = this.state;
//   // up
//   if (
//     window.scrollY > this.lastScroll &&
//     window.innerHeight + window.scrollY >
//       window.innerHeight * activeIndex + window.innerHeight / 2
//   ) {
//     this.setActive(activeIndex + 1);
//     // down
//   } else if (
//     window.scrollY < this.lastScroll &&
//     window.innerHeight + window.scrollY <
//       window.innerHeight * activeIndex - window.innerHeight / 1.5
//   ) {
//     this.setActive(activeIndex - 1);
//   }
//
//   this.lastScroll = window.scrollY;
// }

  setActive (index, scrollTo) {
    this.setState({activeIndex: index}, () => {
      if (scrollTo) {
        this.isAnimating = true
        scrollToY(
          this.refs[`slide-${index}`].offsetTop,
          500,
          'easeInOutQuint',
          () => {
            this.isAnimating = false
          }
        )
      }
    })
  }

  render () {
    const {children} = this.props
    const {activeIndex} = this.state

    if (!children) {
      return null
    }

    return (
      <section {...WheelReact.events} className="viewport-slider">
        <Paginator
          activeIndex={ activeIndex }
          bullets={ children.length }
          onClick={ this.setActive }
        />

        { children.map((child, key) => {
          let index = key + 1
          return (
            <div ref={ `slide-${index}` } key={ index }>
              { React.cloneElement(child, {
                index,
                hideButton: index === children.length,
                onClick: this.setActive
              }) }
            </div>
          )
        }) }
      </section>
    )
  }
}

Slider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

Slider.Item = Item
