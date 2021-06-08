import React from 'react'
export interface PopupProps {
    handleClose(): void,
    content: React.ReactNode
}
export default function Popup(props: PopupProps) {
    return (
        <div className="PopupBox">
            <div className = "PopupContent">
                <span className="close-icon" onClick={props.handleClose}>x</span>
                {props.content}
            </div>
        </div>
    )
}