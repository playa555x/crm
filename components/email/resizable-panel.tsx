import React, { useState, useCallback, useRef, useEffect } from 'react'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize: number
  minSize?: number
  maxSize?: number
}

export function ResizablePanel({ children, defaultSize, minSize = 10, maxSize = 90 }: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize)
  const panelRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  const startResize = useCallback((mouseDownEvent: React.MouseEvent) => {
    const startSize = size
    const startPosition = mouseDownEvent.clientX

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      if (!panelRef.current) return
      const delta = mouseMoveEvent.clientX - startPosition
      const newSize = Math.min(Math.max(startSize + (delta / panelRef.current.parentElement!.clientWidth) * 100, minSize), maxSize)
      setSize(newSize)
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [size, minSize, maxSize])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (panelRef.current && resizeRef.current) {
        resizeRef.current.style.height = `${panelRef.current.clientHeight}px`
      }
    })

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current)
    }

    return () => {
      if (panelRef.current) {
        resizeObserver.unobserve(panelRef.current)
      }
    }
  }, [])

  return (
    <div ref={panelRef} style={{ width: `${size}%` }} className="relative h-full">
      {children}
      <div
        ref={resizeRef}
        className="absolute top-0 right-0 w-1 bg-gray-300 cursor-col-resize"
        onMouseDown={startResize}
      />
    </div>
  )
}

