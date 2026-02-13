import{j as e}from"./jsx-runtime-B4hUth8J.js";import{r as i}from"./iframe-BIROZn-X.js";import{X as ws,S as js}from"./x-CmKUqFDC.js";import{c as J}from"./createLucideIcon-D_yLTFe7.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=J("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=J("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=J("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=J("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);function l({mode:d="single",options:P,value:N,size:ns="md",label:K,placeholder:ee="Select option...",helperText:ae,error:O,searchable:se=!0,clearable:cs=!1,disabled:_=!1,loading:re=!1,fullWidth:ds=!1,required:ps=!1,maxSelected:le,onChange:n,onOpenChange:Y,noResultsMessage:us="No results found",className:ms=""}){const[t,bs]=i.useState(!1),[M,gs]=i.useState(""),[X,Q]=i.useState(0),Z=i.useRef(null),fs=i.useRef(null),te=i.useRef(null),o=Array.isArray(N)?N:N?[N]:[],p=M?P.filter(a=>{var r;return a.label.toLowerCase().includes(M.toLowerCase())||((r=a.description)==null?void 0:r.toLowerCase().includes(M.toLowerCase()))}):P,T=P.filter(a=>o.includes(a.value)).map(a=>a.label),hs={sm:"text-sm px-2.5 py-1.5",md:"text-base px-3 py-2",lg:"text-lg px-4 py-3"},c=a=>{bs(a),Y==null||Y(a),a&&se&&setTimeout(()=>{var r;return(r=te.current)==null?void 0:r.focus()},0)},oe=a=>{if(a.disabled)return;let r;d==="single"?(r=a.value,c(!1)):(r=o.includes(a.value)?o.filter(ys=>ys!==a.value):[...o,a.value],le&&r.length>=le&&c(!1)),n==null||n(r)},Ss=a=>{a.stopPropagation(),n==null||n(d==="single"?"":[])},ie=a=>{if(!t){(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),c(!0));return}switch(a.key){case"ArrowDown":a.preventDefault(),Q(r=>r<p.length-1?r+1:r);break;case"ArrowUp":a.preventDefault(),Q(r=>r>0?r-1:0);break;case"Enter":a.preventDefault(),p[X]&&oe(p[X]);break;case"Escape":a.preventDefault(),c(!1);break}};i.useEffect(()=>{if(!t)return;const a=r=>{Z.current&&!Z.current.contains(r.target)&&c(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[t]);const vs=d==="single"?T[0]||ee:T.length>0?`${T.length} selected`:ee,xs=ds?"w-full":"";return e.jsxs("div",{ref:Z,className:`${xs}`,children:[K&&e.jsxs("label",{className:"block text-sm font-medium text-ds-gray-900 mb-2",children:[K,ps&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{type:"button",onClick:()=>c(!t),onKeyDown:ie,disabled:_||re,"aria-haspopup":"listbox","aria-expanded":t,"aria-disabled":_,"aria-label":K,className:`
            w-full flex items-center justify-between
            bg-white border rounded-md transition-colors duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hs[ns]}
            ${O?"border-red-500":"border-ds-gray-300 hover:border-ds-gray-400"}
            ${t?"border-ds-primary bg-blue-50":""}
            ${ms}
          `,children:[e.jsx("span",{className:"text-ds-gray-700 truncate",children:vs}),e.jsxs("div",{className:"flex items-center gap-1 ml-2 flex-shrink-0",children:[cs&&T.length>0&&!_&&e.jsx("button",{type:"button",onClick:Ss,className:"p-1 hover:bg-ds-gray-200 rounded","aria-label":"Clear selection",children:e.jsx(ws,{size:16})}),re&&e.jsxs("svg",{className:"animate-spin h-4 w-4 text-ds-primary",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx(zs,{size:18,className:`transition-transform ${t?"rotate-180":""}`})]})]}),t&&e.jsxs("div",{ref:fs,className:"absolute z-50 w-full mt-1 bg-white border border-ds-gray-300 rounded-md shadow-lg",role:"listbox","aria-multiselectable":d==="multiple",children:[se&&e.jsx("div",{className:"border-b border-ds-gray-200 p-2",children:e.jsxs("div",{className:"flex items-center gap-2 px-2 py-1 bg-ds-gray-50 rounded",children:[e.jsx(js,{size:16,className:"text-ds-gray-400"}),e.jsx("input",{ref:te,type:"text",placeholder:"Search...",value:M,onChange:a=>{gs(a.target.value),Q(0)},onKeyDown:ie,className:"flex-1 bg-transparent outline-none text-sm"})]})}),e.jsx("div",{className:"max-h-64 overflow-y-auto",children:p.length===0?e.jsx("div",{className:"px-4 py-6 text-center text-sm text-ds-gray-500",children:us}):p.map((a,r)=>e.jsxs("button",{type:"button",onClick:()=>oe(a),role:"option","aria-selected":o.includes(a.value),disabled:a.disabled,className:`
                      w-full text-left px-4 py-2 transition-colors
                      flex items-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                      ${r===X?"bg-blue-100 text-ds-primary":o.includes(a.value)?"bg-blue-50 text-ds-primary font-medium":"hover:bg-ds-gray-100"}
                    `,children:[a.icon&&e.jsx("span",{className:"flex-shrink-0 mt-0.5",children:a.icon}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{children:a.label}),a.description&&e.jsx("div",{className:"text-xs text-ds-gray-500",children:a.description})]}),d==="multiple"&&e.jsx("input",{type:"checkbox",checked:o.includes(a.value),onChange:()=>{},className:"mt-0.5",disabled:a.disabled})]},a.value))})]})]}),O&&e.jsxs("p",{className:"mt-1 text-xs text-red-500 flex items-center",children:[e.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),O]}),ae&&!O&&e.jsx("p",{className:"mt-1 text-xs text-ds-gray-600",children:ae})]})}l.displayName="Select";l.__docgenInfo={description:`Select Component - Dropdown menu for selecting one or multiple options\r
Supports 2 modes (single, multiple)\r
3 sizes (sm, md, lg)\r
Built-in search/filter functionality\r
Grouped options support\r
Full keyboard navigation\r
\r
Accessibility:\r
- ARIA attributes for listbox role\r
- Keyboard navigation (Arrow keys, Enter, Escape)\r
- Screen reader friendly\r
- Focus management`,methods:[],displayName:"Select",props:{mode:{required:!1,tsType:{name:"union",raw:"'single' | 'multiple'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'multiple'"}]},description:`Select mode\r
@default 'single'`,defaultValue:{value:"'single'",computed:!1}},options:{required:!0,tsType:{name:"Array",elements:[{name:"SelectOption"}],raw:"SelectOption[]"},description:"Available options"},value:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:`Selected value(s)\r
- single mode: string\r
- multiple mode: string[]`},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:`Select size\r
@default 'md'`,defaultValue:{value:"'md'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text",defaultValue:{value:"'Select option...'",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:"Helper text below select"},error:{required:!1,tsType:{name:"string"},description:"Error message"},searchable:{required:!1,tsType:{name:"boolean"},description:`Show search input in dropdown\r
@default true`,defaultValue:{value:"true",computed:!1}},clearable:{required:!1,tsType:{name:"boolean"},description:`Clear button to reset selection\r
@default false`,defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:`Disabled state\r
@default false`,defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:`Loading state\r
@default false`,defaultValue:{value:"false",computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:`Full width select\r
@default false`,defaultValue:{value:"false",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:`Required field\r
@default false`,defaultValue:{value:"false",computed:!1}},maxSelected:{required:!1,tsType:{name:"number"},description:"Maximum number of selected items (multiple mode)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string | string[]) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},name:"value"}],return:{name:"void"}}},description:"Callback when value changes"},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:"Callback when dropdown opens/closes"},noResultsMessage:{required:!1,tsType:{name:"string"},description:"No results message",defaultValue:{value:"'No results found'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom CSS class",defaultValue:{value:"''",computed:!1}}},composes:["Omit"]};const Ts={component:l,title:"Components/Select",tags:["autodocs"],argTypes:{mode:{control:"select",options:["single","multiple"],description:"Select mode"},size:{control:"select",options:["sm","md","lg"],description:"Select size"},disabled:{control:"boolean",description:"Disabled state"},loading:{control:"boolean",description:"Loading state"},searchable:{control:"boolean",description:"Show search input"},clearable:{control:"boolean",description:"Show clear button"}}},s=[{value:"apple",label:"Apple",description:"Red and crispy"},{value:"banana",label:"Banana",description:"Yellow and sweet"},{value:"cherry",label:"Cherry",description:"Small and juicy"},{value:"date",label:"Date",description:"Brown and chewy"},{value:"elderberry",label:"Elderberry",description:"Dark and tart"}],is=[{value:"us",label:"United States",icon:e.jsx(u,{size:16})},{value:"uk",label:"United Kingdom",icon:e.jsx(u,{size:16})},{value:"ca",label:"Canada",icon:e.jsx(u,{size:16})},{value:"au",label:"Australia",icon:e.jsx(u,{size:16})},{value:"de",label:"Germany",icon:e.jsx(u,{size:16})}],b={args:{options:s,placeholder:"Select a fruit..."}},W={args:{options:s,label:"Favorite Fruit",placeholder:"Choose your favorite..."}},q={args:{options:s,label:"Fruit Selection",helperText:"Choose your favorite fruit from the list"}},F={args:{options:s,label:"Selected Fruit",value:"apple"}},g={args:{options:s,mode:"multiple",placeholder:"Select multiple fruits..."}},L={args:{options:s,mode:"multiple",label:"Fruits",placeholder:"Select multiple..."}},V={args:{options:s,mode:"multiple",label:"Fruits",value:["apple","banana"]}},A={args:{options:s,mode:"multiple",label:"Select up to 3 fruits",maxSelected:3}},f={args:{options:s,size:"sm",label:"Small Select"}},R={args:{options:s,size:"md",label:"Medium Select"}},E={args:{options:s,size:"lg",label:"Large Select"}},h={args:{options:s,label:"Searchable Select",searchable:!0,placeholder:"Type to search..."}},B={args:{options:s,label:"Clearable Select",value:"apple",clearable:!0}},I={args:{options:s,label:"Disabled Select",disabled:!0,value:"apple"}},U={args:{options:s,label:"Loading Select",loading:!0}},$={args:{options:s,label:"Fruit Selection",error:"Please select a valid fruit"}},H={args:{options:s,label:"Required Field",required:!0}},S={args:{options:is,label:"Select Country",placeholder:"Choose a country..."}},G={args:{options:s,label:"Fruits",searchable:!0,noResultsMessage:"No matching fruits found 🍎"}},v={args:{options:s,label:"Full Width Select",fullWidth:!0}},x={args:{options:s,label:"Select with Descriptions",placeholder:"Choose an option..."}},y={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 p-6 max-w-sm",children:[e.jsx(l,{options:is,label:"Country",placeholder:"Select your country...",required:!0}),e.jsx(l,{options:[{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"other",label:"Other"}],label:"Gender",placeholder:"Select gender..."}),e.jsx(l,{options:[{value:"developer",label:"Developer"},{value:"designer",label:"Designer"},{value:"manager",label:"Manager"},{value:"other",label:"Other"}],label:"Occupation",placeholder:"Select occupation..."})]})},w={render:()=>e.jsx(l,{options:[{value:"react",label:"React",icon:e.jsx(D,{size:16}),description:"JavaScript framework"},{value:"vue",label:"Vue",icon:e.jsx(D,{size:16}),description:"JavaScript framework"},{value:"angular",label:"Angular",icon:e.jsx(D,{size:16}),description:"TypeScript framework"},{value:"svelte",label:"Svelte",icon:e.jsx(D,{size:16}),description:"Compiler framework"}],mode:"multiple",label:"Select Your Skills",placeholder:"Choose skills...",helperText:"Select all that apply",searchable:!0})},j={render:()=>e.jsx(l,{options:[{value:"alice",label:"Alice Johnson",icon:e.jsx(m,{size:16})},{value:"bob",label:"Bob Smith",icon:e.jsx(m,{size:16})},{value:"carol",label:"Carol Davis",icon:e.jsx(m,{size:16})},{value:"david",label:"David Wilson",icon:e.jsx(m,{size:16})},{value:"emma",label:"Emma Brown",icon:e.jsx(m,{size:16})}],mode:"multiple",label:"Assign Team Members",placeholder:"Select members...",helperText:"Select team members to assign to this task",searchable:!0,maxSelected:5})},z={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 p-6",children:[e.jsx(l,{options:s,label:"Default"}),e.jsx(l,{options:s,label:"With Value",value:"apple"}),e.jsx(l,{options:s,label:"Disabled",disabled:!0,value:"banana"}),e.jsx(l,{options:s,label:"Loading",loading:!0}),e.jsx(l,{options:s,label:"With Error",error:"This field is required"}),e.jsx(l,{options:s,label:"Clearable",value:"cherry",clearable:!0})]})},k={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-6",children:[e.jsx(l,{options:s,size:"sm",label:"Small"}),e.jsx(l,{options:s,size:"md",label:"Medium"}),e.jsx(l,{options:s,size:"lg",label:"Large"})]})},C={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 p-6",children:[e.jsx(l,{options:s,mode:"single",label:"Single Select",placeholder:"Choose one..."}),e.jsx(l,{options:s,mode:"multiple",label:"Multiple Select",placeholder:"Choose many..."})]})};var ne,ce,de,pe,ue;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    placeholder: 'Select a fruit...'
  }
}`,...(de=(ce=b.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Basic Single Select Stories",...(ue=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ue.description}}};var me,be,ge;W.parameters={...W.parameters,docs:{...(me=W.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Favorite Fruit',
    placeholder: 'Choose your favorite...'
  }
}`,...(ge=(be=W.parameters)==null?void 0:be.docs)==null?void 0:ge.source}}};var fe,he,Se;q.parameters={...q.parameters,docs:{...(fe=q.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Fruit Selection',
    helperText: 'Choose your favorite fruit from the list'
  }
}`,...(Se=(he=q.parameters)==null?void 0:he.docs)==null?void 0:Se.source}}};var ve,xe,ye;F.parameters={...F.parameters,docs:{...(ve=F.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Selected Fruit',
    value: 'apple'
  }
}`,...(ye=(xe=F.parameters)==null?void 0:xe.docs)==null?void 0:ye.source}}};var we,je,ze,ke,Ce;g.parameters={...g.parameters,docs:{...(we=g.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    mode: 'multiple',
    placeholder: 'Select multiple fruits...'
  }
}`,...(ze=(je=g.parameters)==null?void 0:je.docs)==null?void 0:ze.source},description:{story:"Multiple Select Stories",...(Ce=(ke=g.parameters)==null?void 0:ke.docs)==null?void 0:Ce.description}}};var Ne,Oe,Me;L.parameters={...L.parameters,docs:{...(Ne=L.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Fruits',
    placeholder: 'Select multiple...'
  }
}`,...(Me=(Oe=L.parameters)==null?void 0:Oe.docs)==null?void 0:Me.source}}};var Te,De,We;V.parameters={...V.parameters,docs:{...(Te=V.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Fruits',
    value: ['apple', 'banana']
  }
}`,...(We=(De=V.parameters)==null?void 0:De.docs)==null?void 0:We.source}}};var qe,Fe,Le;A.parameters={...A.parameters,docs:{...(qe=A.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    mode: 'multiple',
    label: 'Select up to 3 fruits',
    maxSelected: 3
  }
}`,...(Le=(Fe=A.parameters)==null?void 0:Fe.docs)==null?void 0:Le.source}}};var Ve,Ae,Re,Ee,Be;f.parameters={...f.parameters,docs:{...(Ve=f.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    size: 'sm',
    label: 'Small Select'
  }
}`,...(Re=(Ae=f.parameters)==null?void 0:Ae.docs)==null?void 0:Re.source},description:{story:"Size Stories",...(Be=(Ee=f.parameters)==null?void 0:Ee.docs)==null?void 0:Be.description}}};var Ie,Ue,$e;R.parameters={...R.parameters,docs:{...(Ie=R.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    size: 'md',
    label: 'Medium Select'
  }
}`,...($e=(Ue=R.parameters)==null?void 0:Ue.docs)==null?void 0:$e.source}}};var He,Ge,Je;E.parameters={...E.parameters,docs:{...(He=E.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    size: 'lg',
    label: 'Large Select'
  }
}`,...(Je=(Ge=E.parameters)==null?void 0:Ge.docs)==null?void 0:Je.source}}};var Pe,Ke,_e,Ye,Xe;h.parameters={...h.parameters,docs:{...(Pe=h.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Searchable Select',
    searchable: true,
    placeholder: 'Type to search...'
  }
}`,...(_e=(Ke=h.parameters)==null?void 0:Ke.docs)==null?void 0:_e.source},description:{story:"Feature Stories",...(Xe=(Ye=h.parameters)==null?void 0:Ye.docs)==null?void 0:Xe.description}}};var Qe,Ze,ea;B.parameters={...B.parameters,docs:{...(Qe=B.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Clearable Select',
    value: 'apple',
    clearable: true
  }
}`,...(ea=(Ze=B.parameters)==null?void 0:Ze.docs)==null?void 0:ea.source}}};var aa,sa,ra;I.parameters={...I.parameters,docs:{...(aa=I.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Disabled Select',
    disabled: true,
    value: 'apple'
  }
}`,...(ra=(sa=I.parameters)==null?void 0:sa.docs)==null?void 0:ra.source}}};var la,ta,oa;U.parameters={...U.parameters,docs:{...(la=U.parameters)==null?void 0:la.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Loading Select',
    loading: true
  }
}`,...(oa=(ta=U.parameters)==null?void 0:ta.docs)==null?void 0:oa.source}}};var ia,na,ca;$.parameters={...$.parameters,docs:{...(ia=$.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Fruit Selection',
    error: 'Please select a valid fruit'
  }
}`,...(ca=(na=$.parameters)==null?void 0:na.docs)==null?void 0:ca.source}}};var da,pa,ua;H.parameters={...H.parameters,docs:{...(da=H.parameters)==null?void 0:da.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Required Field',
    required: true
  }
}`,...(ua=(pa=H.parameters)==null?void 0:pa.docs)==null?void 0:ua.source}}};var ma,ba,ga,fa,ha;S.parameters={...S.parameters,docs:{...(ma=S.parameters)==null?void 0:ma.docs,source:{originalSource:`{
  args: {
    options: countryOptions,
    label: 'Select Country',
    placeholder: 'Choose a country...'
  }
}`,...(ga=(ba=S.parameters)==null?void 0:ba.docs)==null?void 0:ga.source},description:{story:"With Icons Stories",...(ha=(fa=S.parameters)==null?void 0:fa.docs)==null?void 0:ha.description}}};var Sa,va,xa;G.parameters={...G.parameters,docs:{...(Sa=G.parameters)==null?void 0:Sa.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Fruits',
    searchable: true,
    noResultsMessage: 'No matching fruits found 🍎'
  }
}`,...(xa=(va=G.parameters)==null?void 0:va.docs)==null?void 0:xa.source}}};var ya,wa,ja,za,ka;v.parameters={...v.parameters,docs:{...(ya=v.parameters)==null?void 0:ya.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Full Width Select',
    fullWidth: true
  }
}`,...(ja=(wa=v.parameters)==null?void 0:wa.docs)==null?void 0:ja.source},description:{story:"Full Width Stories",...(ka=(za=v.parameters)==null?void 0:za.docs)==null?void 0:ka.description}}};var Ca,Na,Oa,Ma,Ta;x.parameters={...x.parameters,docs:{...(Ca=x.parameters)==null?void 0:Ca.docs,source:{originalSource:`{
  args: {
    options: fruitOptions,
    label: 'Select with Descriptions',
    placeholder: 'Choose an option...'
  }
}`,...(Oa=(Na=x.parameters)==null?void 0:Na.docs)==null?void 0:Oa.source},description:{story:"With Descriptions Stories",...(Ta=(Ma=x.parameters)==null?void 0:Ma.docs)==null?void 0:Ta.description}}};var Da,Wa,qa,Fa,La;y.parameters={...y.parameters,docs:{...(Da=y.parameters)==null?void 0:Da.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 p-6 max-w-sm">\r
      <Select options={countryOptions} label="Country" placeholder="Select your country..." required />\r
      <Select options={[{
      value: 'male',
      label: 'Male'
    }, {
      value: 'female',
      label: 'Female'
    }, {
      value: 'other',
      label: 'Other'
    }]} label="Gender" placeholder="Select gender..." />\r
      <Select options={[{
      value: 'developer',
      label: 'Developer'
    }, {
      value: 'designer',
      label: 'Designer'
    }, {
      value: 'manager',
      label: 'Manager'
    }, {
      value: 'other',
      label: 'Other'
    }]} label="Occupation" placeholder="Select occupation..." />\r
    </div>
}`,...(qa=(Wa=y.parameters)==null?void 0:Wa.docs)==null?void 0:qa.source},description:{story:"Form-like Examples",...(La=(Fa=y.parameters)==null?void 0:Fa.docs)==null?void 0:La.description}}};var Va,Aa,Ra,Ea,Ba;w.parameters={...w.parameters,docs:{...(Va=w.parameters)==null?void 0:Va.docs,source:{originalSource:`{
  render: () => <Select options={[{
    value: 'react',
    label: 'React',
    icon: <Settings size={16} />,
    description: 'JavaScript framework'
  }, {
    value: 'vue',
    label: 'Vue',
    icon: <Settings size={16} />,
    description: 'JavaScript framework'
  }, {
    value: 'angular',
    label: 'Angular',
    icon: <Settings size={16} />,
    description: 'TypeScript framework'
  }, {
    value: 'svelte',
    label: 'Svelte',
    icon: <Settings size={16} />,
    description: 'Compiler framework'
  }]} mode="multiple" label="Select Your Skills" placeholder="Choose skills..." helperText="Select all that apply" searchable />
}`,...(Ra=(Aa=w.parameters)==null?void 0:Aa.docs)==null?void 0:Ra.source},description:{story:"Skills Selection",...(Ba=(Ea=w.parameters)==null?void 0:Ea.docs)==null?void 0:Ba.description}}};var Ia,Ua,$a,Ha,Ga;j.parameters={...j.parameters,docs:{...(Ia=j.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  render: () => <Select options={[{
    value: 'alice',
    label: 'Alice Johnson',
    icon: <Users size={16} />
  }, {
    value: 'bob',
    label: 'Bob Smith',
    icon: <Users size={16} />
  }, {
    value: 'carol',
    label: 'Carol Davis',
    icon: <Users size={16} />
  }, {
    value: 'david',
    label: 'David Wilson',
    icon: <Users size={16} />
  }, {
    value: 'emma',
    label: 'Emma Brown',
    icon: <Users size={16} />
  }]} mode="multiple" label="Assign Team Members" placeholder="Select members..." helperText="Select team members to assign to this task" searchable maxSelected={5} />
}`,...($a=(Ua=j.parameters)==null?void 0:Ua.docs)==null?void 0:$a.source},description:{story:"Team Members Selection",...(Ga=(Ha=j.parameters)==null?void 0:Ha.docs)==null?void 0:Ga.description}}};var Ja,Pa,Ka,_a,Ya;z.parameters={...z.parameters,docs:{...(Ja=z.parameters)==null?void 0:Ja.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 p-6">\r
      <Select options={fruitOptions} label="Default" />\r
      <Select options={fruitOptions} label="With Value" value="apple" />\r
      <Select options={fruitOptions} label="Disabled" disabled value="banana" />\r
      <Select options={fruitOptions} label="Loading" loading />\r
      <Select options={fruitOptions} label="With Error" error="This field is required" />\r
      <Select options={fruitOptions} label="Clearable" value="cherry" clearable />\r
    </div>
}`,...(Ka=(Pa=z.parameters)==null?void 0:Pa.docs)==null?void 0:Ka.source},description:{story:"All States Showcase",...(Ya=(_a=z.parameters)==null?void 0:_a.docs)==null?void 0:Ya.description}}};var Xa,Qa,Za,es,as;k.parameters={...k.parameters,docs:{...(Xa=k.parameters)==null?void 0:Xa.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-6">\r
      <Select options={fruitOptions} size="sm" label="Small" />\r
      <Select options={fruitOptions} size="md" label="Medium" />\r
      <Select options={fruitOptions} size="lg" label="Large" />\r
    </div>
}`,...(Za=(Qa=k.parameters)==null?void 0:Qa.docs)==null?void 0:Za.source},description:{story:"Size Comparison",...(as=(es=k.parameters)==null?void 0:es.docs)==null?void 0:as.description}}};var ss,rs,ls,ts,os;C.parameters={...C.parameters,docs:{...(ss=C.parameters)==null?void 0:ss.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">\r
      <Select options={fruitOptions} mode="single" label="Single Select" placeholder="Choose one..." />\r
      <Select options={fruitOptions} mode="multiple" label="Multiple Select" placeholder="Choose many..." />\r
    </div>
}`,...(ls=(rs=C.parameters)==null?void 0:rs.docs)==null?void 0:ls.source},description:{story:"Mode Comparison",...(os=(ts=C.parameters)==null?void 0:ts.docs)==null?void 0:os.description}}};const Ds=["SingleSelect","WithLabel","WithHelperText","WithValue","MultipleSelect","MultipleWithLabel","MultipleWithValues","MultipleWithMax","SmallSize","MediumSize","LargeSize","Searchable","Clearable","Disabled","Loading","WithError","Required","WithIcons","CustomNoResults","FullWidth","WithDescriptions","ProfileForm","SkillsSelection","TeamMembersSelection","AllStates","SizeComparison","ModeComparison"];export{z as AllStates,B as Clearable,G as CustomNoResults,I as Disabled,v as FullWidth,E as LargeSize,U as Loading,R as MediumSize,C as ModeComparison,g as MultipleSelect,L as MultipleWithLabel,A as MultipleWithMax,V as MultipleWithValues,y as ProfileForm,H as Required,h as Searchable,b as SingleSelect,k as SizeComparison,w as SkillsSelection,f as SmallSize,j as TeamMembersSelection,x as WithDescriptions,$ as WithError,q as WithHelperText,S as WithIcons,W as WithLabel,F as WithValue,Ds as __namedExportsOrder,Ts as default};
