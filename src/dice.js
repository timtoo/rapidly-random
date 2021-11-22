import * as React from "react";
import { SvgIcon } from "@mui/material"

import t6die1 from './img/m6die1.svg'
import t6die2 from './img/m6die2.svg'
import t6die3 from './img/m6die3.svg'
import t6die4 from './img/m6die4.svg'
import t6die5 from './img/m6die5.svg'
import t6die6 from './img/m6die6.svg'

//import {ReactComponent as rt6die3} from './img/nt6die3.svg'

const die6array = [
  t6die1,
  t6die2,
  t6die3,
  t6die4,
  t6die5,
  t6die6,
]

function Die6img(props) {
  console.log("dprops ", props)
  const { die, alt, size, ...more } = props
  if (size) {
    if (!("style" in more)) {
      more.style = {}
    }
    more.style.width = size
    more.style.height = size
  }

  return (
    <><img src={die6array[parseInt(die)-1]} alt={alt} {...more}/></>
  )
}


function SvgT6Die1(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="#fff"
          strokeWidth={9.939}
        />
        <circle cx={250} cy={250} r={46.333} fill="#141414" strokeWidth={10} />
      </g>
    </svg>
  );
}

function SvgT6Die2(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="#fff"
          strokeWidth={9.939}
        />
        <circle
          cx={369.82}
          cy={373.42}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={126.58}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
      </g>
    </svg>
  );
}

function SvgT6Die3(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="#fff"
          strokeWidth={9.939}
        />
        <circle
          cx={369.82}
          cy={373.42}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={126.58}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle cx={250} cy={250} r={46.333} fill="#141414" strokeWidth={10} />
      </g>
    </svg>
  );
}

function SvgT6Die4(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="#fff"
          strokeWidth={9.939}
        />
        <circle
          cx={369.82}
          cy={373.42}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={126.58}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={369.82}
          cy={-126.58}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={-373.42}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
      </g>
    </svg>
  );
}

function SvgT6Die5(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="#fff"
          strokeWidth={9.939}
        />
        <circle
          cx={369.82}
          cy={373.42}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={126.58}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle cx={250} cy={250} r={46.333} fill="#141414" strokeWidth={10} />
        <circle
          cx={369.82}
          cy={-126.58}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={-373.42}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
      </g>
    </svg>
  );
}

function SvgT6Die6(props) {
  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="#000">
        <rect
          width={490.061}
          height={490.061}
          x={4.97}
          y={4.97}
          ry={176.325}
          fill="currentColor"
          strokeWidth={9.939}
        />
        <circle
          cx={369.82}
          cy={373.42}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={126.58}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={250}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={369.82}
          cy={-126.58}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={130.18}
          cy={-373.42}
          r={46.333}
          transform="scale(1 -1)"
          fill="#141414"
          strokeWidth={10}
        />
        <circle
          cx={369.82}
          cy={250}
          r={46.333}
          fill="#141414"
          strokeWidth={10}
        />
      </g>
    </svg>
  );
}

export default {
  Die6img,
 // rt6die3,
  t6die1,
  t6die2,
  t6die3,
  t6die4,
  t6die5,
  t6die6,
  SvgT6Die1,
  SvgT6Die2,
  SvgT6Die3,
  SvgT6Die4,
  SvgT6Die5,
  SvgT6Die6,
}

