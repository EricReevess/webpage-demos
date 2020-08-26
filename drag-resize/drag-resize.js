(function (window) {
  window.dragResize = function (elemSelector, wrapSelector, minWidth = 5, minHeight = 5) {
    dragElement(elemSelector, wrapSelector)
    resizeRect(elemSelector, minWidth, minHeight)
  }
})(window)

function dragElement (elemSelector, wrapSelector) {
  let elemDom = document.querySelector(elemSelector)
  let wrapDom = document.querySelector(wrapSelector)
  let mouseDownOffsetX, mouseDownOffsetY, mouseMoveClientX, mouseMoveClientY, elemLeft, elemTop
  let { offsetHeight, offsetWidth } = elemDom
  wrapDom.style.position = 'relative'
  elemDom.style.position = 'absolute'
  elemDom.addEventListener('mousemove', elemMouseMove)


  function onElemMousedown (e) {
    mouseDownOffsetX = e.offsetX
    mouseDownOffsetY = e.offsetY
    wrapDom.addEventListener('mousemove', mouseMoveOnWrap)
    wrapDom.addEventListener('mouseup', removeListener)
    wrapDom.addEventListener('mouseleave', removeListener)
  }

  function mouseMoveOnWrap (e) {
    mouseMoveClientX = e.clientX
    mouseMoveClientY = e.clientY
    elemLeft = mouseMoveClientX - mouseDownOffsetX
    elemTop = mouseMoveClientY - mouseDownOffsetY
    elemDom.style.left = elemLeft + 'px'
    elemDom.style.top = elemTop + 'px'

  }

  function elemMouseMove (e) {
    const { offsetX, offsetY } = e
    offsetHeight = e.target.offsetHeight
    offsetWidth = e.target.offsetWidth
    if (offsetX > 6 && offsetX < offsetWidth - 6 && offsetY > 6 && offsetY < offsetHeight - 6) {
      e.target.style.cursor = 'move'
      elemDom.addEventListener('mousedown', onElemMousedown)
      return null
    } else if (offsetY > -5 && offsetY < 5) {
      if (offsetX > -5 && offsetX < 5) {
        e.target.style.cursor = 'nw-resize'
      } else if (offsetX > offsetWidth - 5 && offsetX < offsetWidth + 5) {
        e.target.style.cursor = 'ne-resize'
      } else {
        e.target.style.cursor = 'n-resize'
      }
    } else if (offsetY > offsetHeight - 5 && offsetY < offsetHeight + 5) {
      if (offsetX > -5 && offsetX < 5) {
        e.target.style.cursor = 'sw-resize'
      } else if (offsetX > offsetWidth - 5 && offsetX < offsetWidth + 5) {
        e.target.style.cursor = 'se-resize'
      } else {
        e.target.style.cursor = 'n-resize'
      }
    } else if (offsetX > -5 && offsetX < 5 || offsetX > offsetWidth - 5 && offsetX < offsetWidth + 5) {
      e.target.style.cursor = 'e-resize'
    } else {
      e.target.style.cursor = 'default'
    }
    elemDom.removeEventListener('mousedown', onElemMousedown)
  }


  function removeListener (e) {
    e.target.style.cursor = 'default'
    wrapDom.removeEventListener('mousemove', mouseMoveOnWrap)
    wrapDom.removeEventListener('mouseup', arguments.callee)
    wrapDom.removeEventListener('mouseleave', arguments.callee)
  }
}


function resizeRect (elemSelector, minWidth, minHeight) {
  let clientClickDownX, clientClickDownY, currentClientX, currentClientY, rectMouseOffsetX, rectMouseOffsetY
  let elemDom = document.querySelector(elemSelector)
  let elemHeight = elemDom.offsetHeight
  let elemWidth = elemDom.offsetWidth
  let elemTop = elemDom.offsetTop
  let elemLeft = elemDom.offsetLeft
  elemDom.style.minHeight = minHeight + 'px'
  elemDom.style.minWidth = minWidth + 'px'
  elemDom.addEventListener('mousedown', function (e) {
    clientClickDownX = e.clientX
    clientClickDownY = e.clientY
    rectMouseOffsetX = e.offsetX
    rectMouseOffsetY = e.offsetY
    if (rectMouseOffsetY > 0 && rectMouseOffsetY < 5) {
      document.addEventListener('mousemove', rectTopResize)
    }
    if (rectMouseOffsetY < elemHeight + 5 && rectMouseOffsetY > elemHeight - 5) {
      document.addEventListener('mousemove', rectBottomResize)
    }
    if (rectMouseOffsetX > -5 && rectMouseOffsetX < 5) {
      document.addEventListener('mousemove', rectLeftResize)
    }
    if (rectMouseOffsetX < elemWidth + 5 && rectMouseOffsetX > elemWidth - 5) {
      document.addEventListener('mousemove', rectRightResize)
    }
  })
  document.addEventListener('mouseup', function () {
    elemTop = elemDom.offsetTop
    elemLeft = elemDom.offsetLeft
    elemHeight = elemDom.offsetHeight
    elemWidth = elemDom.offsetWidth
    document.removeEventListener('mousemove', rectTopResize)
    document.removeEventListener('mousemove', rectBottomResize)
    document.removeEventListener('mousemove', rectLeftResize)
    document.removeEventListener('mousemove', rectRightResize)

  })

  function rectTopResize (e) {
    currentClientY = e.clientY
    elemDom.style.height = elemHeight + (clientClickDownY - currentClientY) + 'px'
    if (elemDom.offsetHeight === minHeight) {
      elemDom.style.top = elemDom.offsetTop + 'px'
    } else {
      elemDom.style.top = elemTop - (clientClickDownY - currentClientY) + 'px'
    }

  }

  function rectBottomResize (e) {
    currentClientY = e.clientY
    elemDom.style.height = elemHeight + (currentClientY - clientClickDownY) + 'px'
  }

  function rectLeftResize (e) {
    currentClientX = e.clientX
    elemDom.style.width = elemWidth + (clientClickDownX - currentClientX) + 'px'
    if (elemDom.offsetWidth === minWidth) {
      elemDom.style.left = elemDom.offsetLeft + 'px'
    } else {
      elemDom.style.left = elemLeft - (clientClickDownX - currentClientX) + 'px'
    }
  }

  function rectRightResize (e) {
    currentClientX = e.clientX
    elemDom.style.width = elemWidth + (currentClientX - clientClickDownX) + 'px'
  }
}
