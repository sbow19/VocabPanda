/* eslint-disable */

import { Overlay, OverlayProps } from "@rneui/base"
import CoreStyles from "app/shared_styles/core_styles"


const parseProps = props=>{

    const customProps = {
        style: {}
    }

    if(props.style){
        customProps.style = props.style
    }


    return customProps
}

{/* Add animation to pop up view */}

const AppOverlay: React.FC<OverlayProps> = props=>{

    const customProps = parseProps(props)

    return(
        <Overlay
            isVisible={props.isVisible}
            overlayStyle={[
                CoreStyles.defaultOverlayStyles,
                customProps.style
            ]}
        
        >
            {props.children}
        </Overlay>
    )
}

export default AppOverlay