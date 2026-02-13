import{j as e}from"./jsx-runtime-B4hUth8J.js";import{r as G}from"./iframe-BIROZn-X.js";import{M as b,L as A}from"./mail-BFbG0dB6.js";import{c as K}from"./createLucideIcon-D_yLTFe7.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dr=K("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=K("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=K("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]),a=G.forwardRef(({type:pr="text",size:ur="md",state:mr="default",label:Q,helperText:R,error:f,success:y,startIcon:H,endIcon:V,disabled:hr=!1,loading:B=!1,fullWidth:gr=!1,required:X=!1,showCharCount:Y=!1,maxCharCount:Z,className:br="",value:U,onChange:_,onFocus:J,onBlur:O,placeholder:fr,"aria-label":yr,"aria-describedby":xr,id:r,...wr},Sr)=>{const[x,ee]=G.useState(!1),[vr,Ir]=G.useState(typeof U=="string"?U.length:0),ae=f?"error":y?"success":mr,re=hr||B,Er="w-full px-3 py-2 bg-white border rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary disabled:opacity-50 disabled:cursor-not-allowed font-normal",zr={sm:"text-sm px-2.5 py-1.5",md:"text-base px-3 py-2",lg:"text-lg px-4 py-3"},jr={default:`border-ds-gray-300 ${x?"border-ds-primary bg-blue-50":"hover:border-ds-gray-400"}`,error:`border-red-500 ${x?"bg-red-50":"bg-white"}`,success:`border-green-500 ${x?"bg-green-50":"bg-white"}`,warning:`border-yellow-500 ${x?"bg-yellow-50":"bg-white"}`},se="flex items-center justify-center w-5 h-5 text-ds-gray-600",Tr=gr?"w-full":"",Cr=s=>{Ir(s.target.value.length),_==null||_(s)},Nr=s=>{ee(!0),J==null||J(s)},Wr=s=>{ee(!1),O==null||O(s)},Lr=[xr,f?`${r}-error`:void 0,y?`${r}-success`:void 0,Y?`${r}-charcount`:void 0,R?`${r}-helper`:void 0].filter(Boolean).join(" ");return e.jsxs("div",{className:`${Tr}`,children:[Q&&e.jsxs("label",{htmlFor:r,className:"block text-sm font-medium text-ds-gray-900 mb-2",children:[Q,X&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[H&&e.jsx("div",{className:`absolute left-3 top-1/2 -translate-y-1/2 ${se}`,children:H}),e.jsx("input",{ref:Sr,id:r,type:pr,value:U,onChange:Cr,onFocus:Nr,onBlur:Wr,disabled:re,required:X,placeholder:fr,"aria-label":yr,"aria-describedby":Lr||void 0,"aria-disabled":re,"aria-invalid":ae==="error","aria-busy":B,className:`${Er} ${zr[ur]} ${jr[ae]} ${H?"pl-10":""} ${V?"pr-10":""} ${br}`,...wr}),V&&e.jsx("div",{className:`absolute right-3 top-1/2 -translate-y-1/2 ${se}`,children:V}),B&&e.jsx("div",{className:"absolute right-3 top-1/2 -translate-y-1/2",children:e.jsxs("svg",{className:"animate-spin h-4 w-4 text-ds-primary",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})})]}),Y&&e.jsxs("div",{id:`${r}-charcount`,className:"mt-1 text-xs text-ds-gray-600 text-right",children:[vr,Z&&`/${Z}`]}),R&&e.jsx("p",{id:`${r}-helper`,className:"mt-1 text-xs text-ds-gray-600",children:R}),f&&e.jsxs("p",{id:`${r}-error`,className:"mt-1 text-xs text-red-500 flex items-center",children:[e.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20","aria-hidden":"true",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),f]}),y&&e.jsxs("p",{id:`${r}-success`,className:"mt-1 text-xs text-green-500 flex items-center",children:[e.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20","aria-hidden":"true",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),y]})]})});a.displayName="Input";a.__docgenInfo={description:`Input Component - Core text input field\r
Supports multiple types (text, password, email, number, etc.)\r
3 sizes (sm, md, lg)\r
4 states (default, error, success, warning)\r
Optional icons, labels, and helper text\r
\r
Accessibility:\r
- Semantic input element\r
- Associated label for screen readers\r
- Error messages with aria-describedby\r
- Full keyboard navigation support\r
- Focus indicators for visibility\r
- Loading state with aria-busy`,methods:[],displayName:"Input",props:{className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:`Disabled state\r
@default false`,defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:`Loading state (shows spinner, disables interaction)\r
@default false`,defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:`Input size\r
@default 'md'`,defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},description:""},type:{required:!1,tsType:{name:"union",raw:"'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'password'"},{name:"literal",value:"'email'"},{name:"literal",value:"'number'"},{name:"literal",value:"'tel'"},{name:"literal",value:"'url'"},{name:"literal",value:"'search'"}]},description:`Input type\r
@default 'text'`,defaultValue:{value:"'text'",computed:!1}},state:{required:!1,tsType:{name:"union",raw:"'default' | 'error' | 'success' | 'warning'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'error'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"}]},description:`Input state (visual feedback)\r
@default 'default'`,defaultValue:{value:"'default'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text (optional)"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text below input"},error:{required:!1,tsType:{name:"string"},description:"Error message (sets state to 'error' if provided)"},success:{required:!1,tsType:{name:"string"},description:"Success message (sets state to 'success' if provided)"},startIcon:{required:!1,tsType:{name:"ReactNode"},description:"Icon/element to display on the left"},endIcon:{required:!1,tsType:{name:"ReactNode"},description:"Icon/element to display on the right"},required:{required:!1,tsType:{name:"boolean"},description:"Makes input required",defaultValue:{value:"false",computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:`Full width input\r
@default false`,defaultValue:{value:"false",computed:!1}},showCharCount:{required:!1,tsType:{name:"boolean"},description:"Character count display",defaultValue:{value:"false",computed:!1}},maxCharCount:{required:!1,tsType:{name:"number"},description:"Maximum character count (for display)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.ChangeEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactChangeEvent",raw:"React.ChangeEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:"Callback when input value changes"},onFocus:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.FocusEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactFocusEvent",raw:"React.FocusEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:"Callback on focus"},onBlur:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.FocusEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactFocusEvent",raw:"React.FocusEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:"Callback on blur"}},composes:["Omit"]};const Ar={component:a,title:"Components/Input",tags:["autodocs"],argTypes:{type:{control:"select",options:["text","password","email","number","tel","url","search"],description:"Input type"},size:{control:"select",options:["sm","md","lg"],description:"Input size"},state:{control:"select",options:["default","error","success","warning"],description:"Input state"},disabled:{control:"boolean",description:"Disabled state"},loading:{control:"boolean",description:"Loading state with spinner"},fullWidth:{control:"boolean",description:"Full width input"},required:{control:"boolean",description:"Required field"},showCharCount:{control:"boolean",description:"Show character count"}}},t={args:{placeholder:"Enter text"}},w={args:{label:"Full Name",placeholder:"John Doe"}},S={args:{label:"Email",placeholder:"your@email.com",required:!0}},l={args:{type:"email",label:"Email Address",placeholder:"your@email.com",startIcon:e.jsx(b,{size:18})}},v={args:{type:"password",label:"Password",placeholder:"Enter password",startIcon:e.jsx(A,{size:18})}},I={args:{type:"number",label:"Age",placeholder:"Enter age"}},E={args:{type:"tel",label:"Phone Number",placeholder:"+1 (555) 123-4567",startIcon:e.jsx(qr,{size:18})}},z={args:{type:"url",label:"Website",placeholder:"https://example.com"}},j={args:{type:"search",placeholder:"Search..."}},o={args:{size:"sm",label:"Small Input",placeholder:"Small size"}},T={args:{size:"md",label:"Medium Input",placeholder:"Medium size"}},C={args:{size:"lg",label:"Large Input",placeholder:"Large size"}},n={args:{label:"Default State",placeholder:"Enter text",state:"default"}},N={args:{label:"Email",placeholder:"your@email.com",state:"error",error:"This email is already registered"}},W={args:{label:"Email",placeholder:"your@email.com",state:"success",success:"Email verified successfully",endIcon:e.jsx($,{size:18,className:"text-green-500"})}},L={args:{label:"Password",placeholder:"Enter password",state:"warning",helperText:"Password is weak, use at least 12 characters"}},i={args:{label:"Email",placeholder:"Enter email",startIcon:e.jsx(b,{size:18})}},q={args:{label:"Password",placeholder:"Enter password",type:"password",endIcon:e.jsx(dr,{size:18})}},M={args:{label:"Email",placeholder:"your@email.com",startIcon:e.jsx(b,{size:18}),endIcon:e.jsx($,{size:18,className:"text-green-500"})}},c={args:{label:"Email",placeholder:"your@email.com",helperText:"We will only use this for login purposes"}},k={args:{label:"Username",placeholder:"Enter username",error:"Username must be at least 3 characters",startIcon:e.jsx(dr,{size:18,className:"text-red-500"})}},F={args:{label:"Username",placeholder:"john_doe",success:"Username is available",endIcon:e.jsx($,{size:18,className:"text-green-500"})}},d={args:{label:"Disabled Field",placeholder:"Cannot edit",disabled:!0,value:"Disabled value"}},D={args:{label:"Email",placeholder:"your@email.com",loading:!0,helperText:"Validating..."}},p={args:{label:"Bio",placeholder:"Tell us about yourself",showCharCount:!0,maxCharCount:160}},u={args:{label:"Full Name",placeholder:"Enter full name",fullWidth:!0}},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4 max-w-md",children:[e.jsx(a,{type:"email",label:"Email",placeholder:"your@email.com",startIcon:e.jsx(b,{size:18}),fullWidth:!0,required:!0}),e.jsx(a,{type:"password",label:"Password",placeholder:"Enter password",startIcon:e.jsx(A,{size:18}),fullWidth:!0,required:!0})]})},P={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4 max-w-md",children:[e.jsx(a,{type:"text",label:"Full Name",placeholder:"John Doe",fullWidth:!0,required:!0}),e.jsx(a,{type:"email",label:"Email",placeholder:"your@email.com",startIcon:e.jsx(b,{size:18}),fullWidth:!0,required:!0}),e.jsx(a,{type:"password",label:"Password",placeholder:"Enter password",startIcon:e.jsx(A,{size:18}),helperText:"At least 8 characters",fullWidth:!0,required:!0}),e.jsx(a,{type:"password",label:"Confirm Password",placeholder:"Confirm password",startIcon:e.jsx(A,{size:18}),fullWidth:!0,required:!0})]})},h={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[e.jsx(a,{size:"sm",label:"Small",placeholder:"Small input"}),e.jsx(a,{size:"md",label:"Medium",placeholder:"Medium input"}),e.jsx(a,{size:"lg",label:"Large",placeholder:"Large input"})]})},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4 max-w-md",children:[e.jsx(a,{label:"Default",placeholder:"Default state",state:"default"}),e.jsx(a,{label:"Error",placeholder:"Error state",error:"Something went wrong"}),e.jsx(a,{label:"Success",placeholder:"Success state",success:"All good!",endIcon:e.jsx($,{size:18,className:"text-green-500"})}),e.jsx(a,{label:"Warning",placeholder:"Warning state",state:"warning",helperText:"Please check this"}),e.jsx(a,{label:"Disabled",placeholder:"Disabled",disabled:!0}),e.jsx(a,{label:"Loading",placeholder:"Loading...",loading:!0})]})};var te,le,oe,ne,ie;t.parameters={...t.parameters,docs:{...(te=t.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text'
  }
}`,...(oe=(le=t.parameters)==null?void 0:le.docs)==null?void 0:oe.source},description:{story:"Basic Input Stories",...(ie=(ne=t.parameters)==null?void 0:ne.docs)==null?void 0:ie.description}}};var ce,de,pe;w.parameters={...w.parameters,docs:{...(ce=w.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: 'Full Name',
    placeholder: 'John Doe'
  }
}`,...(pe=(de=w.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var ue,me,he;S.parameters={...S.parameters,docs:{...(ue=S.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    required: true
  }
}`,...(he=(me=S.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};var ge,be,fe,ye,xe;l.parameters={...l.parameters,docs:{...(ge=l.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    startIcon: <Mail size={18} />
  }
}`,...(fe=(be=l.parameters)==null?void 0:be.docs)==null?void 0:fe.source},description:{story:"Input Type Stories",...(xe=(ye=l.parameters)==null?void 0:ye.docs)==null?void 0:xe.description}}};var we,Se,ve;v.parameters={...v.parameters,docs:{...(we=v.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    startIcon: <Lock size={18} />
  }
}`,...(ve=(Se=v.parameters)==null?void 0:Se.docs)==null?void 0:ve.source}}};var Ie,Ee,ze;I.parameters={...I.parameters,docs:{...(Ie=I.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    type: 'number',
    label: 'Age',
    placeholder: 'Enter age'
  }
}`,...(ze=(Ee=I.parameters)==null?void 0:Ee.docs)==null?void 0:ze.source}}};var je,Te,Ce;E.parameters={...E.parameters,docs:{...(je=E.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    type: 'tel',
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    startIcon: <Phone size={18} />
  }
}`,...(Ce=(Te=E.parameters)==null?void 0:Te.docs)==null?void 0:Ce.source}}};var Ne,We,Le;z.parameters={...z.parameters,docs:{...(Ne=z.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    type: 'url',
    label: 'Website',
    placeholder: 'https://example.com'
  }
}`,...(Le=(We=z.parameters)==null?void 0:We.docs)==null?void 0:Le.source}}};var qe,Me,ke;j.parameters={...j.parameters,docs:{...(qe=j.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...(ke=(Me=j.parameters)==null?void 0:Me.docs)==null?void 0:ke.source}}};var Fe,De,Pe,Ae,$e;o.parameters={...o.parameters,docs:{...(Fe=o.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    label: 'Small Input',
    placeholder: 'Small size'
  }
}`,...(Pe=(De=o.parameters)==null?void 0:De.docs)==null?void 0:Pe.source},description:{story:"Size Stories",...($e=(Ae=o.parameters)==null?void 0:Ae.docs)==null?void 0:$e.description}}};var Re,He,Ve;T.parameters={...T.parameters,docs:{...(Re=T.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    size: 'md',
    label: 'Medium Input',
    placeholder: 'Medium size'
  }
}`,...(Ve=(He=T.parameters)==null?void 0:He.docs)==null?void 0:Ve.source}}};var Be,Ue,_e;C.parameters={...C.parameters,docs:{...(Be=C.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    label: 'Large Input',
    placeholder: 'Large size'
  }
}`,...(_e=(Ue=C.parameters)==null?void 0:Ue.docs)==null?void 0:_e.source}}};var Je,Oe,Ge,Ke,Qe;n.parameters={...n.parameters,docs:{...(Je=n.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    label: 'Default State',
    placeholder: 'Enter text',
    state: 'default'
  }
}`,...(Ge=(Oe=n.parameters)==null?void 0:Oe.docs)==null?void 0:Ge.source},description:{story:"State Stories",...(Qe=(Ke=n.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Xe,Ye,Ze;N.parameters={...N.parameters,docs:{...(Xe=N.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    state: 'error',
    error: 'This email is already registered'
  }
}`,...(Ze=(Ye=N.parameters)==null?void 0:Ye.docs)==null?void 0:Ze.source}}};var ea,aa,ra;W.parameters={...W.parameters,docs:{...(ea=W.parameters)==null?void 0:ea.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    state: 'success',
    success: 'Email verified successfully',
    endIcon: <Check size={18} className="text-green-500" />
  }
}`,...(ra=(aa=W.parameters)==null?void 0:aa.docs)==null?void 0:ra.source}}};var sa,ta,la;L.parameters={...L.parameters,docs:{...(sa=L.parameters)==null?void 0:sa.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    state: 'warning',
    helperText: 'Password is weak, use at least 12 characters'
  }
}`,...(la=(ta=L.parameters)==null?void 0:ta.docs)==null?void 0:la.source}}};var oa,na,ia,ca,da;i.parameters={...i.parameters,docs:{...(oa=i.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    startIcon: <Mail size={18} />
  }
}`,...(ia=(na=i.parameters)==null?void 0:na.docs)==null?void 0:ia.source},description:{story:"Icon Stories",...(da=(ca=i.parameters)==null?void 0:ca.docs)==null?void 0:da.description}}};var pa,ua,ma;q.parameters={...q.parameters,docs:{...(pa=q.parameters)==null?void 0:pa.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    endIcon: <AlertCircle size={18} />
  }
}`,...(ma=(ua=q.parameters)==null?void 0:ua.docs)==null?void 0:ma.source}}};var ha,ga,ba;M.parameters={...M.parameters,docs:{...(ha=M.parameters)==null?void 0:ha.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    startIcon: <Mail size={18} />,
    endIcon: <Check size={18} className="text-green-500" />
  }
}`,...(ba=(ga=M.parameters)==null?void 0:ga.docs)==null?void 0:ba.source}}};var fa,ya,xa,wa,Sa;c.parameters={...c.parameters,docs:{...(fa=c.parameters)==null?void 0:fa.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    helperText: 'We will only use this for login purposes'
  }
}`,...(xa=(ya=c.parameters)==null?void 0:ya.docs)==null?void 0:xa.source},description:{story:"Helper Text Stories",...(Sa=(wa=c.parameters)==null?void 0:wa.docs)==null?void 0:Sa.description}}};var va,Ia,Ea;k.parameters={...k.parameters,docs:{...(va=k.parameters)==null?void 0:va.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: 'Username must be at least 3 characters',
    startIcon: <AlertCircle size={18} className="text-red-500" />
  }
}`,...(Ea=(Ia=k.parameters)==null?void 0:Ia.docs)==null?void 0:Ea.source}}};var za,ja,Ta;F.parameters={...F.parameters,docs:{...(za=F.parameters)==null?void 0:za.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'john_doe',
    success: 'Username is available',
    endIcon: <Check size={18} className="text-green-500" />
  }
}`,...(Ta=(ja=F.parameters)==null?void 0:ja.docs)==null?void 0:Ta.source}}};var Ca,Na,Wa,La,qa;d.parameters={...d.parameters,docs:{...(Ca=d.parameters)==null?void 0:Ca.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Disabled value'
  }
}`,...(Wa=(Na=d.parameters)==null?void 0:Na.docs)==null?void 0:Wa.source},description:{story:"State Interaction Stories",...(qa=(La=d.parameters)==null?void 0:La.docs)==null?void 0:qa.description}}};var Ma,ka,Fa;D.parameters={...D.parameters,docs:{...(Ma=D.parameters)==null?void 0:Ma.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    loading: true,
    helperText: 'Validating...'
  }
}`,...(Fa=(ka=D.parameters)==null?void 0:ka.docs)==null?void 0:Fa.source}}};var Da,Pa,Aa,$a,Ra;p.parameters={...p.parameters,docs:{...(Da=p.parameters)==null?void 0:Da.docs,source:{originalSource:`{
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    showCharCount: true,
    maxCharCount: 160
  }
}`,...(Aa=(Pa=p.parameters)==null?void 0:Pa.docs)==null?void 0:Aa.source},description:{story:"Character Count Stories",...(Ra=($a=p.parameters)==null?void 0:$a.docs)==null?void 0:Ra.description}}};var Ha,Va,Ba,Ua,_a;u.parameters={...u.parameters,docs:{...(Ha=u.parameters)==null?void 0:Ha.docs,source:{originalSource:`{
  args: {
    label: 'Full Name',
    placeholder: 'Enter full name',
    fullWidth: true
  }
}`,...(Ba=(Va=u.parameters)==null?void 0:Va.docs)==null?void 0:Ba.source},description:{story:"Full Width Stories",...(_a=(Ua=u.parameters)==null?void 0:Ua.docs)==null?void 0:_a.description}}};var Ja,Oa,Ga,Ka,Qa;m.parameters={...m.parameters,docs:{...(Ja=m.parameters)==null?void 0:Ja.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4 max-w-md">\r
      <Input type="email" label="Email" placeholder="your@email.com" startIcon={<Mail size={18} />} fullWidth required />\r
      <Input type="password" label="Password" placeholder="Enter password" startIcon={<Lock size={18} />} fullWidth required />\r
    </div>
}`,...(Ga=(Oa=m.parameters)==null?void 0:Oa.docs)==null?void 0:Ga.source},description:{story:"Form-like Stories",...(Qa=(Ka=m.parameters)==null?void 0:Ka.docs)==null?void 0:Qa.description}}};var Xa,Ya,Za;P.parameters={...P.parameters,docs:{...(Xa=P.parameters)==null?void 0:Xa.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4 max-w-md">\r
      <Input type="text" label="Full Name" placeholder="John Doe" fullWidth required />\r
      <Input type="email" label="Email" placeholder="your@email.com" startIcon={<Mail size={18} />} fullWidth required />\r
      <Input type="password" label="Password" placeholder="Enter password" startIcon={<Lock size={18} />} helperText="At least 8 characters" fullWidth required />\r
      <Input type="password" label="Confirm Password" placeholder="Confirm password" startIcon={<Lock size={18} />} fullWidth required />\r
    </div>
}`,...(Za=(Ya=P.parameters)==null?void 0:Ya.docs)==null?void 0:Za.source}}};var er,ar,rr,sr,tr;h.parameters={...h.parameters,docs:{...(er=h.parameters)==null?void 0:er.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4">\r
      <Input size="sm" label="Small" placeholder="Small input" />\r
      <Input size="md" label="Medium" placeholder="Medium input" />\r
      <Input size="lg" label="Large" placeholder="Large input" />\r
    </div>
}`,...(rr=(ar=h.parameters)==null?void 0:ar.docs)==null?void 0:rr.source},description:{story:"All Sizes Showcase",...(tr=(sr=h.parameters)==null?void 0:sr.docs)==null?void 0:tr.description}}};var lr,or,nr,ir,cr;g.parameters={...g.parameters,docs:{...(lr=g.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4 max-w-md">\r
      <Input label="Default" placeholder="Default state" state="default" />\r
      <Input label="Error" placeholder="Error state" error="Something went wrong" />\r
      <Input label="Success" placeholder="Success state" success="All good!" endIcon={<Check size={18} className="text-green-500" />} />\r
      <Input label="Warning" placeholder="Warning state" state="warning" helperText="Please check this" />\r
      <Input label="Disabled" placeholder="Disabled" disabled />\r
      <Input label="Loading" placeholder="Loading..." loading />\r
    </div>
}`,...(nr=(or=g.parameters)==null?void 0:or.docs)==null?void 0:nr.source},description:{story:"All States Showcase",...(cr=(ir=g.parameters)==null?void 0:ir.docs)==null?void 0:cr.description}}};const $r=["Basic","WithLabel","Required","EmailType","PasswordType","NumberType","PhoneType","UrlType","SearchType","SmallSize","MediumSize","LargeSize","DefaultState","ErrorState","SuccessState","WarningState","WithStartIcon","WithEndIcon","WithBothIcons","WithHelperText","WithErrorMessage","WithSuccessMessage","Disabled","Loading","CharacterCount","FullWidth","LoginForm","SignupForm","AllSizes","AllStates"];export{h as AllSizes,g as AllStates,t as Basic,p as CharacterCount,n as DefaultState,d as Disabled,l as EmailType,N as ErrorState,u as FullWidth,C as LargeSize,D as Loading,m as LoginForm,T as MediumSize,I as NumberType,v as PasswordType,E as PhoneType,S as Required,j as SearchType,P as SignupForm,o as SmallSize,W as SuccessState,z as UrlType,L as WarningState,M as WithBothIcons,q as WithEndIcon,k as WithErrorMessage,c as WithHelperText,w as WithLabel,i as WithStartIcon,F as WithSuccessMessage,$r as __namedExportsOrder,Ar as default};
