
import * as React from "react"

// Define breakpoints for different device sizes
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the correct event listener method based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(checkMobile)
    }
    
    checkMobile()
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile)
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(checkMobile)
      }
    }
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    const handleResize = () => {
      checkTablet()
    }
    
    window.addEventListener("resize", handleResize)
    checkTablet()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return !!isTablet
}
