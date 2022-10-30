import React from "react"

export default function Timer({ time }) {
    return (
        <div className="time-container">
            <span className="digits">
                {("0" + Math.floor((time / 1000))).slice(-2)}.
            </span>
            <span className="digits">
                {time>0 ? ((time) % 1000) : "000"}
            </span>
        </div>
    )
}