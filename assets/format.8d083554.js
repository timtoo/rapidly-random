import{c as M,a as u,h as k,b as Q,T as j,U as Z,r as A,g as R,V as G,s as z,W as J,z as K,X as _,w as F,Y as ee,x as te,y as $,Z as oe,$ as I,i as y,F as w,a0 as le,a1 as ie}from"./index.8b87045b.js";var ve=M({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:t}){const o=u(()=>parseInt(e.lines,10)),l=u(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(o.value===1?" ellipsis":"")),n=u(()=>e.lines!==void 0&&o.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":o.value}:null);return()=>k("div",{style:n.value,class:l.value},Q(t.default))}});const D={dark:{type:Boolean,default:null}};function O(e,t){return u(()=>e.dark===null?t.dark.isActive:e.dark)}const me={name:String};function pe(e={}){return(t,o,l)=>{t[o](k("input",{class:"hidden"+(l||""),...e.value}))}}function we(e){return u(()=>e.name||e.for)}var be=M({name:"QItem",props:{...D,...j,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:t,emit:o}){const{proxy:{$q:l}}=R(),n=O(e,l),{hasRouterLink:m,hasLink:s,linkProps:a,linkClass:c,linkTag:T,navigateToRouterLink:d}=Z(),b=A(null),p=A(null),g=u(()=>e.clickable===!0||s.value===!0||e.tag==="label"),f=u(()=>e.disable!==!0&&g.value===!0),E=u(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(n.value===!0?" q-item--dark":"")+(s.value===!0&&e.active===null?c.value:e.active===!0?`${e.activeClass!==void 0?` ${e.activeClass}`:""} q-item--active`:"")+(e.disable===!0?" disabled":"")+(f.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),x=u(()=>{if(e.insetLevel===void 0)return null;const r=l.lang.rtl===!0?"Right":"Left";return{["padding"+r]:16+e.insetLevel*56+"px"}});function S(r){f.value===!0&&(p.value!==null&&(r.qKeyEvent!==!0&&document.activeElement===b.value?p.value.focus():document.activeElement===p.value&&b.value.focus()),m.value===!0&&d(r),o("click",r))}function i(r){if(f.value===!0&&G(r,13)===!0){z(r),r.qKeyEvent=!0;const W=new MouseEvent("click",r);W.qKeyEvent=!0,b.value.dispatchEvent(W)}o("keyup",r)}function v(){const r=J(t.default,[]);return f.value===!0&&r.unshift(k("div",{class:"q-focus-helper",tabindex:-1,ref:p})),r}return()=>{const r={ref:b,class:E.value,style:x.value,onClick:S,onKeyup:i};return f.value===!0?(r.tabindex=e.tabindex||"0",Object.assign(r,a.value)):g.value===!0&&(r["aria-disabled"]="true"),k(T.value,r,v())}}}),he=M({name:"QList",props:{...D,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean},setup(e,{slots:t}){const o=R(),l=O(e,o.proxy.$q),n=u(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(l.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>k("div",{class:n.value},Q(t.default))}});function ye(e,t,o){let l;function n(){l!==void 0&&(_.remove(l),l=void 0)}return K(()=>{e.value===!0&&n()}),{removeFromHistory:n,addToHistory(){l={condition:()=>o.value===!0,handler:t},_.add(l)}}}const ge={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},qe=["before-show","show","before-hide","hide"];function Le({showing:e,canShow:t,hideOnRouteChange:o,handleShow:l,handleHide:n,processOnMount:m}){const s=R(),{props:a,emit:c,proxy:T}=s;let d;function b(i){e.value===!0?f(i):p(i)}function p(i){if(a.disable===!0||i!==void 0&&i.qAnchorHandled===!0||t!==void 0&&t(i)!==!0)return;const v=a["onUpdate:modelValue"]!==void 0;v===!0&&(c("update:modelValue",!0),d=i,$(()=>{d===i&&(d=void 0)})),(a.modelValue===null||v===!1)&&g(i)}function g(i){e.value!==!0&&(e.value=!0,c("before-show",i),l!==void 0?l(i):c("show",i))}function f(i){if(a.disable===!0)return;const v=a["onUpdate:modelValue"]!==void 0;v===!0&&(c("update:modelValue",!1),d=i,$(()=>{d===i&&(d=void 0)})),(a.modelValue===null||v===!1)&&E(i)}function E(i){e.value!==!1&&(e.value=!1,c("before-hide",i),n!==void 0?n(i):c("hide",i))}function x(i){a.disable===!0&&i===!0?a["onUpdate:modelValue"]!==void 0&&c("update:modelValue",!1):i===!0!==e.value&&(i===!0?g:E)(d)}F(()=>a.modelValue,x),o!==void 0&&ee(s)===!0&&F(()=>T.$route.fullPath,()=>{o.value===!0&&e.value===!0&&f()}),m===!0&&te(()=>{x(a.modelValue)});const S={show:p,hide:f,toggle:b};return Object.assign(T,S),S}const ne=[null,document,document.body,document.scrollingElement,document.documentElement];function ke(e,t){let o=oe(t);if(o===void 0){if(e==null)return window;o=e.closest(".scroll,.scroll-y,.overflow-auto")}return ne.includes(o)?window:o}function re(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function se(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let C;function Te(){if(C!==void 0)return C;const e=document.createElement("p"),t=document.createElement("div");I(e,{width:"100%",height:"200px"}),I(t,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(e),document.body.appendChild(t);const o=e.offsetWidth;t.style.overflow="scroll";let l=e.offsetWidth;return o===l&&(l=t.clientWidth),t.remove(),C=o-l,C}function ae(e,t=!0){return!e||e.nodeType!==Node.ELEMENT_NODE?!1:t?e.scrollHeight>e.clientHeight&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-y"])):e.scrollWidth>e.clientWidth&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-x"]))}let q=0,P,B,L,H=!1,U,X,h;function ue(e){ce(e)&&z(e)}function ce(e){if(e.target===document.body||e.target.classList.contains("q-layout__backdrop"))return!0;const t=le(e),o=e.shiftKey&&!e.deltaX,l=!o&&Math.abs(e.deltaX)<=Math.abs(e.deltaY),n=o||l?e.deltaY:e.deltaX;for(let m=0;m<t.length;m++){const s=t[m];if(ae(s,l))return l?n<0&&s.scrollTop===0?!0:n>0&&s.scrollTop+s.clientHeight===s.scrollHeight:n<0&&s.scrollLeft===0?!0:n>0&&s.scrollLeft+s.clientWidth===s.scrollWidth}return!0}function Y(e){e.target===document&&(document.scrollingElement.scrollTop=document.scrollingElement.scrollTop)}function V(e){H!==!0&&(H=!0,requestAnimationFrame(()=>{H=!1;const{height:t}=e.target,{clientHeight:o,scrollTop:l}=document.scrollingElement;(L===void 0||t!==window.innerHeight)&&(L=o-t,document.scrollingElement.scrollTop=l),l>L&&(document.scrollingElement.scrollTop-=Math.ceil((l-L)/8))}))}function N(e){const t=document.body,o=window.visualViewport!==void 0;if(e==="add"){const{overflowY:l,overflowX:n}=window.getComputedStyle(t);P=se(window),B=re(window),U=t.style.left,X=t.style.top,t.style.left=`-${P}px`,t.style.top=`-${B}px`,n!=="hidden"&&(n==="scroll"||t.scrollWidth>window.innerWidth)&&t.classList.add("q-body--force-scrollbar-x"),l!=="hidden"&&(l==="scroll"||t.scrollHeight>window.innerHeight)&&t.classList.add("q-body--force-scrollbar-y"),t.classList.add("q-body--prevent-scroll"),document.qScrollPrevented=!0,y.is.ios===!0&&(o===!0?(window.scrollTo(0,0),window.visualViewport.addEventListener("resize",V,w.passiveCapture),window.visualViewport.addEventListener("scroll",V,w.passiveCapture),window.scrollTo(0,0)):window.addEventListener("scroll",Y,w.passiveCapture))}y.is.desktop===!0&&y.is.mac===!0&&window[`${e}EventListener`]("wheel",ue,w.notPassive),e==="remove"&&(y.is.ios===!0&&(o===!0?(window.visualViewport.removeEventListener("resize",V,w.passiveCapture),window.visualViewport.removeEventListener("scroll",V,w.passiveCapture)):window.removeEventListener("scroll",Y,w.passiveCapture)),t.classList.remove("q-body--prevent-scroll"),t.classList.remove("q-body--force-scrollbar-x"),t.classList.remove("q-body--force-scrollbar-y"),document.qScrollPrevented=!1,t.style.left=U,t.style.top=X,window.scrollTo(P,B),L=void 0)}function de(e){let t="add";if(e===!0){if(q++,h!==void 0){clearTimeout(h),h=void 0;return}if(q>1)return}else{if(q===0||(q--,q>0))return;if(t="remove",y.is.ios===!0&&y.is.nativeMobile===!0){clearTimeout(h),h=setTimeout(()=>{N(t),h=void 0},100);return}}N(t)}function Ee(){let e;return{preventBodyScroll(t){t!==e&&(e!==void 0||t===!0)&&(e=t,de(t))}}}function xe(){let e;return K(()=>{clearTimeout(e)}),{registerTimeout(t,o){clearTimeout(e),e=setTimeout(t,o)},removeTimeout(){clearTimeout(e)}}}function Se(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),ie.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}function Ce(e,t,o){return o<=t?t:Math.min(o,Math.max(t,e))}export{he as Q,D as a,me as b,pe as c,Se as d,ge as e,qe as f,xe as g,Le as h,ye as i,Ce as j,Ee as k,ke as l,re as m,se as n,Te as o,ve as p,be as q,we as r,O as u};
