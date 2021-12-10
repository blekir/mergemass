import React from 'react';


export default function Info(props) {

return(
    <>
        {props.d?<div>{props.d["id"]}</div>:null}
    </>
)
}